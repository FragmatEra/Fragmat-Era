const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
    }
});

exports.checkout = async (req, res) => {
    try {
        const { name, address, phone, city, postal, items } = req.body;
        console.log(req.body);
        if (!name || !address || !phone || !city || !postal || !items || !items.length) {
            return res.status(400).json({ message: 'Missing order details.' });
        }
        // Compose order message
        let message = `New Order:\nCustomer: ${name}\nAddress: ${address}\nPhone: ${phone}\nCity: ${city}\nPostal Code: ${postal}\n\nItems:\n`;
        let total = 0;
        items.forEach(item => {
            message += `${item.name} - Rs/-${item.price} x ${item.quantity || 1}\n`;
            total += item.price * (item.quantity || 1);
        });
        // Calculate shipping
        let shipping = total > 2999 ? 0 : 200;
        message += `\nSubtotal: Rs/-${total}`;
        message += `\nShipping: ${shipping === 0 ? 'Free (order above Rs/-2999)' : 'Rs/-200'}`;
        message += `\nTotal: Rs/-${total + shipping}`;

        // Generate a unique order ID and date/time string
        const now = new Date();
        const orderId = now.getTime();
        const timeString = now.toLocaleString('en-GB', { hour12: false }); // e.g. 14:23 21/07/2024
        const subject = `New Order #${orderId} from ${name} at ${timeString}`;

        // Send email to yourself (owner)
        await transporter.sendMail({
            from: process.env.GMAIL_USER,
            to: process.env.GMAIL_USER, // send to yourself
            subject,
            text: message
        });

        // Send confirmation email to customer
        const customerEmail = req.body.email; // always use the email from the checkout form
        if (customerEmail && customerEmail !== process.env.GMAIL_USER) {
            const customerSubject = `Your Fragmet Era Order Confirmation #${orderId}`;
            const customerMessage = `Dear ${name},\n\nThank you for your order at Fragmet Era!\n\nYour order (ID: ${orderId}) has been received and is being processed.\n\nOrder Details:\n${items.map(item => `${item.name} - Rs/-${item.price} x ${item.quantity || 1}`).join('\n')}\n\nSubtotal: Rs/-${total}\nShipping: ${shipping === 0 ? 'Free (order above Rs/-2999)' : 'Rs/-200'}\nTotal: Rs/-${total + shipping}\n\nDelivery Address:\n${address}, ${city}, ${postal}\n\nIf you have any questions, reply to this email.\n\nBest regards,\nFragmet Era Team`;
            await transporter.sendMail({
                from: process.env.GMAIL_USER,
                to: customerEmail,
                subject: customerSubject,
                text: customerMessage
            });
        }

        // Clear the user's cart in the database (only if logged in)
        const Cart = require('../models/Cart');
        if (req.user && req.user._id) {
            await Cart.findOneAndUpdate(
                { user: req.user._id },
                { $set: { items: [] } }
            );
        }

        res.json({ message: 'Order placed and email sent to owner!', orderId });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Server error.' });
    }
}; 