import Product from '../models/Product.js';

export const getProducts = async (req, res) => {
    try {
        const keyword = req.query.keyword
            ? {
                title: {
                    $regex: req.query.keyword,
                    $options: 'i',
                },
            }
            : {};



        let query = { ...keyword, status: 'Available' };

        
        if (req.user && req.user.university && req.user.university !== 'Unspecified') {
            query.university = req.user.university;
        }

        const products = await Product.find(query).populate('user', 'name avatar university');
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('user', 'name avatar university email');

        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createProduct = async (req, res) => {
    const { title, description, price, category, condition, type, coordinates } = req.body;
    let images = [];

    if (req.files && req.files.length > 0) {
        images = req.files.map(file => file.path);
    } else if (req.body.images) {
        images = req.body.images;
    }

    try {
        let parsedCoordinates = coordinates;
        if (typeof coordinates === 'string') {
            try {
                parsedCoordinates = JSON.parse(coordinates);
            } catch (e) {
                console.error("Error parsing coordinates", e);
            }
        }

        const product = new Product({
            user: req.user._id,
            title,
            description,
            price,
            category,
            condition,
            type,
            images,
            coordinates: parsedCoordinates,
            university: req.user.university || 'Unspecified',
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            if (product.user.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'Not authorized to delete this product' });
            }
            await product.deleteOne();
            res.json({ message: 'Product removed' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
