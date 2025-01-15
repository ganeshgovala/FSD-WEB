const express = require('express');
const app = express();

app.use(express.json());
app.post('/submit', (req, res) => {
    const { name, email } = req.body;
    console.log('Form Data:', name, email);
    res.send('Form submitted successfully!');
});

app.listen(3000, () => console.log('Server running on port 3000'));
