const sdk = require('node-appwrite');

// Initialize Appwrite SDK
const client = new sdk.Client();
client
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

const databases = new sdk.Databases(client);

module.exports = async (req, res) => {
    try {
        const payload = JSON.parse(req.payload || '{}');
        const { $id: documentId, orderId, orderStatus, buyerEmail, buyerName } = payload;

        console.log(`Processing order notification: ${orderId} - Status: ${orderStatus}`);

        // Get full order details
        const order = await databases.getDocument(
            process.env.APPWRITE_DATABASE_ID,
            'orders',
            documentId
        );

        // Send appropriate notification based on status
        switch (orderStatus) {
            case 'confirmed':
                await sendOrderConfirmation(order);
                break;
            case 'shipped':
                await sendShippingNotification(order);
                break;
            case 'delivered':
                await sendDeliveryNotification(order);
                break;
            case 'cancelled':
                await sendCancellationNotification(order);
                break;
            default:
                console.log(`No notification needed for status: ${orderStatus}`);
        }

        // Update order timestamp
        await databases.updateDocument(
            process.env.APPWRITE_DATABASE_ID,
            'orders',
            documentId,
            {
                updatedAt: new Date().toISOString()
            }
        );

        console.log(`✅ Notification sent for order ${orderId}`);
        res.json({ success: true, message: 'Notification sent successfully' });

    } catch (error) {
        console.error('❌ Notification failed:', error);
        res.json({ success: false, error: error.message });
    }
};

async function sendOrderConfirmation(order) {
    const subject = `Order Confirmed - ${order.orderNumber}`;
    const message = `
        Dear ${order.buyerName},

        Your order has been confirmed!

        Order Details:
        - Order Number: ${order.orderNumber}
        - Total Amount: ₹${order.totalAmount}
        - Expected Delivery: ${new Date(order.estimatedDelivery).toLocaleDateString()}

        Items:
        ${JSON.parse(order.items).map(item =>
            `- ${item.title} (₹${item.price})`
        ).join('\n')}

        Thank you for shopping with CultureCart!

        Best regards,
        CultureCart Team
    `;

    await sendEmail(order.buyerEmail, subject, message);
}

async function sendShippingNotification(order) {
    const subject = `Order Shipped - ${order.orderNumber}`;
    const message = `
        Dear ${order.buyerName},

        Great news! Your order has been shipped.

        Order Details:
        - Order Number: ${order.orderNumber}
        - Tracking Number: ${order.trackingNumber || 'Will be updated soon'}
        - Shipping Address: ${JSON.parse(order.shippingAddress).street}, ${JSON.parse(order.shippingAddress).city}

        You can track your order at: https://culturecart.in/track/${order.orderId}

        Thank you for choosing CultureCart!

        Best regards,
        CultureCart Team
    `;

    await sendEmail(order.buyerEmail, subject, message);
}

async function sendDeliveryNotification(order) {
    const subject = `Order Delivered - ${order.orderNumber}`;
    const message = `
        Dear ${order.buyerName},

        Your order has been successfully delivered!

        Order Details:
        - Order Number: ${order.orderNumber}
        - Delivered On: ${new Date(order.deliveredAt).toLocaleDateString()}

        We hope you love your authentic Indian crafts!

        Please leave a review to help other customers and support our artisans.

        Rate your purchase: https://culturecart.in/review/${order.orderId}

        Thank you for being part of the CultureCart community!

        Best regards,
        CultureCart Team
    `;

    await sendEmail(order.buyerEmail, subject, message);

    // Also notify the artisan(s)
    const items = JSON.parse(order.items);
    const artisanIds = [...new Set(items.map(item => item.artisanId))];

    for (const artisanId of artisanIds) {
        const artisan = await databases.getDocument(
            process.env.APPWRITE_DATABASE_ID,
            'artisans',
            artisanId
        );

        const artisanSubject = `Order Delivered - ${order.orderNumber}`;
        const artisanMessage = `
            Dear ${artisan.name},

            Your product has been successfully delivered to the customer!

            Order Details:
            - Order Number: ${order.orderNumber}
            - Customer: ${order.buyerName}
            - Amount: ₹${order.totalAmount}

            Payment will be processed to your account within 3-5 business days.

            Keep creating amazing crafts!

            Best regards,
            CultureCart Team
        `;

        await sendEmail(artisan.email, artisanSubject, artisanMessage);
    }
}

async function sendCancellationNotification(order) {
    const subject = `Order Cancelled - ${order.orderNumber}`;
    const message = `
        Dear ${order.buyerName},

        Your order has been cancelled.

        Order Details:
        - Order Number: ${order.orderNumber}
        - Cancellation Reason: ${order.notes || 'Requested by customer'}

        If you have any questions, please contact our support team.

        We're sorry for any inconvenience caused.

        Best regards,
        CultureCart Team
    `;

    await sendEmail(order.buyerEmail, subject, message);
}

async function sendEmail(to, subject, message) {
    // Placeholder for email service integration
    // In production, integrate with:
    // - SendGrid, Mailgun, or AWS SES
    // - Appwrite's built-in email service

    console.log(`📧 Sending email to ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Message: ${message}`);

    // Simulate email sending
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Log email analytics
    await databases.createDocument(
        process.env.APPWRITE_DATABASE_ID,
        'analytics',
        'unique()',
        {
            eventId: `email_${Date.now()}`,
            eventType: 'email_sent',
            userId: null, // Could be buyer or artisan ID
            metadata: JSON.stringify({
                type: 'order_notification',
                recipient: to,
                subject
            }),
            timestamp: new Date().toISOString()
        }
    );
}
