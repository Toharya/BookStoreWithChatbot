const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const { execFile } = require("child_process");
const app = express();
const port = 4000;
const jwt = require("jsonwebtoken");
const multer = require("multer");
const { log } = require("console");
const { type } = require("os");

app.use(cors());
app.use(bodyParser.json());
app.use('/images', express.static('upload/images'));

// Database Connection With MongoDB
mongoose.connect("mongodb+srv://elifarslan001halic:zxZFZAgd5rd5foQN@cluster0.ji63ldu.mongodb.net/e-commerce", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// API Creation
app.get("/", (req, res) => {
    res.send("Express App is Running");
});

// Recommender API
app.post("/recommend", (req, res) => {
    const preferences = req.body;
    const preferencesJSON = JSON.stringify(preferences);

    console.log("Preferences received:", preferences);  // Loglama eklendi

    const options = {
        encoding: "utf-8"
    };

    execFile("python", ["filter_books.py", preferencesJSON], options, (error, stdout, stderr) => {
        if (error) {
            console.error("Error executing Python script:", error);
            return res.status(500).json({ error: "Error executing Python script" });
        }

        try {
            const filteredBooks = JSON.parse(stdout);
            console.log("Filtered Books:", filteredBooks);  // Loglama eklendi
            res.json(filteredBooks);
        } catch (e) {
            console.error("Error parsing JSON:", e);
            res.status(500).json({ error: "Error parsing JSON" });
        }
    });
});

const storage = multer.diskStorage({
    destination: './upload/images',
    filename:(req,file,cb)=>{
        return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({storage:storage})


// Creating Upload Endpoint for images
app.use('/images',express.static('upload/images'))

app.post("/upload",upload.single('product'),(req,res)=>{
    res.json({
        success:1,
        image_url:`http://localhost:${port}/images/${req.file.filename}`
    })
})

// Schema for Creating Products

const Product = mongoose.model("Product", {
    id: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    writer: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    new_price: {
        type: Number,
        required: true,
    },
    old_price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    publisher: {
        type: String,
        required: true,
    },
    page_number: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    available: {
        type: Boolean,
        default: true,
    },
});

app.post('/addproduct', async (req, res) => {
    let products = await Product.find({});
    let id;
    if (products.length > 0) {
        let last_product_array = products.slice(-1);
        let last_product = last_product_array[0];
        id = last_product.id + 1;
    } else {
        id = 1;
    }
    const product = new Product({
        id: id,
        name: req.body.name,
        writer: req.body.writer,
        image: req.body.image,
        category: req.body.category,
        new_price: req.body.new_price,
        old_price: req.body.old_price,
        description: req.body.description,
        publisher: req.body.publisher,
        page_number: req.body.page_number,
    });
    console.log(product);
    await product.save();
    console.log("Saved");
    res.json({
        success: true,
        name: req.body.name,
    });
});

//Creating API for deleting products

app.post('/removeproduct', async (req, res) => {
    await Product.findOneAndDelete({ id: req.body.id });
    console.log("Removed");
    res.json({
        success: true,
        name: req.body.name
    });
});

//Creating API for getting all products
app.get('/allproducts', async (req, res) => {
    let products = await Product.find({});
    console.log("All Products Fetched");
    res.send(products);
});

// Endpoint for search
app.get('/search', async (req, res) => {
    const query = req.query.q;
    try {
        const products = await Product.find({
            name: { $regex: query, $options: 'i' }
        });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error searching for products', error });
    }
});

//Schema creating for user model

const Users = mongoose.model('Users', {
    name: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
    },
    cartData: {
        type: Object,
    },
    date: {
        type: Date,
        default: Date.now,
    }

});

//Creating Endpoint for registering the user
app.post('/signup', async (req, res) => {

    let check = await Users.findOne({ email: req.body.email });
    if (check) {
        return res.status(400).json({ success: false, errors: "there is a user with this email address" })
    }
    let cart = {};
    for (let i = 0; i < 300; i++) {
        cart[i] = 0;
    }
    const user = new Users({
        name: req.body.username,
        email: req.body.email,
        password: req.body.password,
        cartData: cart,
    })

    await user.save();

    const data = {
        user: {
            id: user.id
        }
    }

    const token = jwt.sign(data, 'secret_ecom');
    res.json({ success: true, token })

})

//Creating endpoint for user login
app.post('/login', async (req, res) => {
    let user = await Users.findOne({ email: req.body.email });
    if (user) {
        const passCompare = req.body.password === user.password;
        if (passCompare) {
            const data = {
                user: {
                    id: user.id
                }
            }
            const token = jwt.sign(data, 'secret_ecom');
            res.json({ success: true, token });

        }
        else {
            res.json({ success: false, errors: "wrong password" });
        }
    }
    else {
        res.json({ success: false, errors: "wrong email" })
    }

})

// Creating Endpoint for New Books Data
app.get('/newbooks', async (req, res) => {
    // Fetch all products and sort them by date in descending order
    let products = await Product.find({}).sort({ date: -1 });
    // Select the first 8 products (assuming they are the newest)
    let newbooks = products.slice(0, 8);
    console.log("NewBooks Fetched");
    res.send(newbooks);
})

//Creating Endpoint for popular in literature section
app.get('/popularinliterature', async (req, res) => {
    let products = await Product.find({ category: "literature" });
    let popular_in_literature = products.slice(0, 4);
    console.log("Popular in literature fetched");
    res.send(popular_in_literature);
})

//creating endpoint to fetch description of books
app.get('/product/:id', async (req, res) => {
    try {
        const product = await Product.findOne({ id: req.params.id });
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching product', error });
    }
});

// Creating endpoint for fetching products based on category
app.get('/products/:category', async (req, res) => {
    const category = req.params.category;
    try {
        const products = await Product.find({ category });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products by category', error });
    }
});

// creating middleware to fetch user
const fetchUser = async (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) {
        res.status(401).send({ errors: "please authenticate using valid token" })
    }
    else {
        try {
            const data = jwt.verify(token, 'secret_ecom');
            req.user = data.user;
            next();
        } catch (error) {
            res.status(401).send({ errors: "please authenticate using a valid token" })
        }
    }
}

// creating endpoint for adding products in cartdata
app.post('/addtocart', fetchUser, async (req, res) => {
    console.log("added", req.body.itemId);
    let userData = await Users.findOne({ _id: req.user.id });
    userData.cartData[req.body.itemId] += 1;
    await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
    res.send("Added")
})

app.post('/removefromcart', fetchUser, async (req, res) => {
    console.log("removed", req.body.itemId);
    try {
        const userData = await Users.findOne({ _id: req.user.id });
        if (userData.cartData[req.body.itemId] > 0) {
            // Set quantity to 0 for the specified item
            userData.cartData[req.body.itemId] = 0;
            await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
            res.json({ success: true, message: 'All quantities of the item removed from cart' });
        } else {
            res.status(404).json({ success: false, message: 'Item not found in cart' });
        }
    } catch (error) {
        console.error('Error removing item from cart:', error);
        res.status(500).json({ success: false, message: 'An error occurred while removing item from cart' });
    }
});

// creating endpoint to get cartdata
app.post('/getcart', fetchUser, async (req, res) => {
    console.log("GetCart");
    let userData = await Users.findOne({ _id: req.user.id });
    res.json(userData.cartData);
})

// creating endpoint to reset cart data
app.post('/resetcart', fetchUser, async (req, res) => {
    try {
        let userData = await Users.findOne({ _id: req.user.id });
        if (userData) {
            let cart = {};
            for (let itemId in userData.cartData) {
                cart[itemId] = 0;
            }
            userData.cartData = cart;
            await userData.save();
            res.json({ success: true, message: 'Cart has been reset' });
        } else {
            res.status(404).json({ success: false, message: 'User not found' });
        }
    } catch (error) {
        console.error('Error resetting cart:', error);
        res.status(500).json({ success: false, message: 'An error occurred while resetting the cart' });
    }
});



// Updating a product
app.put('/updateproduct/:id', async (req, res) => {
    try {
        const updatedProduct = await Product.findOneAndUpdate(
            { id: req.params.id },
            { $set: req.body },
            { new: true }
        );
        if (updatedProduct) {
            res.json({ success: true, product: updatedProduct });
        } else {
            res.status(404).json({ success: false, message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating product', error });
    }
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// Wildcard route: Redirect all other requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

app.listen(port, (error) => {
    if (!error) {
        console.log("Server Running on Port " + port);
    } else {
        console.log("Error : " + error);
    }
});
