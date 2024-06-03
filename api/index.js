const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const imageDownloader = require('image-downloader');
const multer = require('multer');
const fs = require('fs');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const mime = require('mime-types');

const User = require('./models/User');
const Place = require('./models/Place');
const Booking = require('./models/Booking');

require('dotenv').config();

const app = express();

const bcryptSalt = bcrypt.genSaltSync(12);
const jwtSecret = 'adwwdadsgsefadwwafwdawd';
const bucket = 'eugen-booking-app';

app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173',
}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'))

async function uploadToS3(path, originalFilename, mimetype) {
    const client = new S3Client({
        region: 'eu-north-1',
        credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY,
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
        }
    });

    const parts = originalFilename.split('.');
    const extension = parts[parts.length - 1];
    const newFileName = Date.now() + '.' + extension;

    await client.send(new PutObjectCommand({
        Bucket: bucket,
        Body: fs.readFileSync(path),
        Key: newFileName,
        ContentType: mimetype,
        ACL: 'public-read',
    }))

    return `https://${bucket}.s3.amazonaws.com/${newFileName}`;
}

function getUserDataFromReq(req) {
    return new Promise((resolve, reject) => {
        jwt.verify(req.cookies.token, jwtSecret, {}, async (err, userData) => {
            if (err) throw err;
            resolve(userData);
        });
    });
}


app.post('/api/register', async (req, res) => {
    mongoose.connect(process.env.MONGO_URL)
    const { name, email, password } = req.body;

    try {
        const userDoc = await User.create({
            name,
            email,
            password: bcrypt.hashSync(password, bcryptSalt),
        });
        res.json(userDoc);
    } catch (err) {
        res.status(401).json(err);
        throw new Error(err)

    }
})

app.post('/api/login', async (req, res) => {
    mongoose.connect(process.env.MONGO_URL)
    const { email, password } = req.body;
    const userDoc = await User.findOne({ email });
    if (userDoc) {
        const passOk = bcrypt.compareSync(password, userDoc.password);
        if (passOk) {
            jwt.sign({
                email: userDoc.email,
                id: userDoc._id,
            }, jwtSecret, {}, (err, token) => {
                if (err) {
                    throw new Error(err);
                } else {
                    res.cookie('token', token).json(userDoc)
                }
            })
        } else {
            res.status(422).json('pass not ok')
        }
    } else {
        res.json('Not found')
    }
})

app.get('/api/profile', (req, res) => {
    mongoose.connect(process.env.MONGO_URL)
    const { token } = req.cookies;
    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
            if (err) throw new Error(err);
            const { name, email, id } = await User.findById(userData.id)
            res.json({ name, email, id });
        })
    } else {
        res.json(null);
    }
})

app.post('/api/logout', (req, res) => {
    res.cookie('token', '').json(true);
});

app.post('/api/upload-by-link', async (req, res) => {
    mongoose.connect(process.env.MONGO_URL)

    const { link } = req.body;
    const newName = 'photo' + Date.now() + '.jpg';
    await imageDownloader.image({
        url: link,
        dest: '/tmp/' + newName,
    });
    const url = await uploadToS3('/tmp/' + newName, newName, mime.lookup('/tmp/' + newName));
    res.json(url);
});


const photosMiddleware = multer({ dest: '/tmp' });

app.post('/api/upload', photosMiddleware.array('photos', 100), async (req, res) => {
    mongoose.connect(process.env.MONGO_URL)
    const uploadedFiles = [];

    for (let i = 0; i < req.files.length; i++) {
        const { path, originalname, mimetype } = req.files[i];
        const url = await uploadToS3(path, originalname, mimetype)
        uploadedFiles.push(url);
    }
    res.json(uploadedFiles);
});

app.post('/api/places', (req, res) => {
    mongoose.connect(process.env.MONGO_URL)
    const { token } = req.cookies;
    const {
        title,
        address,
        addedPhotos,
        description,
        perks,
        extraInfo,
        checkIn,
        checkOut,
        maxGuests,
        price
    } = req.body;

    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) throw new Error(err);

        const placeDoc = await Place.create({
            owner: userData.id,
            title,
            address,
            photos: addedPhotos,
            description,
            perks,
            extraInfo,
            checkIn,
            checkOut,
            maxGuests,
            price
        })

        res.json(placeDoc);
    })

})

app.put('/api/places', async (req, res) => {
    mongoose.connect(process.env.MONGO_URL)
    const { token } = req.cookies;
    const {
        id,
        title,
        address,
        addedPhotos,
        description,
        perks,
        extraInfo,
        checkIn,
        checkOut,
        maxGuests,
        price
    } = req.body;


    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        const placeDoc = await Place.findById(id);

        if (userData.id === placeDoc.owner.toString()) {
            placeDoc.set({
                title,
                address,
                photos: addedPhotos,
                description,
                perks,
                extraInfo,
                checkIn,
                checkOut,
                maxGuests,
                price
            })
            await placeDoc.save();

            res.json('ok')
        }
    })

})

app.get('/api/user-places', async (req, res) => {
    mongoose.connect(process.env.MONGO_URL)
    const { token } = req.cookies;

    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) throw new Error(err);

        const { id } = userData;

        res.json(await Place.find({
            owner: id
        }))
    })
})

app.get('/api/places/:id', async (req, res) => {
    mongoose.connect(process.env.MONGO_URL)
    const { id } = req.params;
    res.json(await Place.findById(id))
})

app.get('/api/places', async (req, res) => {
    mongoose.connect(process.env.MONGO_URL)
    res.json(await Place.find())
})

app.post('/api/booking', async (req, res) => {
    mongoose.connect(process.env.MONGO_URL)
    const userData = await getUserDataFromReq(req);

    const {
        checkIn,
        checkOut,
        place,
        numberOfGuests,
        name,
        phone,
        price
    } = req.body;

    const data = await Booking.create({
        checkIn,
        checkOut,
        place,
        numberOfGuests,
        name,
        phone,
        price,
        user: userData.id
    });

    res.json(data)
})

app.get('/api/bookings', async (req, res) => {
    mongoose.connect(process.env.MONGO_URL)
    const userData = await getUserDataFromReq(req);
    res.json(await Booking.find({ user: userData.id }).populate('place'));
})


app.listen(3000);