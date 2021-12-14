const express = require('express');
const app = express();

app.get('/', (req, res) => {
   res.status(400).send('<h1>Invest Inc API</h1>')
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>{
    console.log('App listening at port ', PORT);
})