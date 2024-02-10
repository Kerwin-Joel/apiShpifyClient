const express = require('express');
const cors = require('cors');
require('dotenv').config();


const app  = express()

const endPoint = process.env.ENDPOINT
const accesPoint = process.env.ACCES_POINT
const port = 3001

app.use(cors()); 
const graphqlEndpoint = endPoint;

app.get('/shopify', async (req,res)=>{

  const productoSKU = req.query.SKU

  const query = `
  {
      files(query: "${productoSKU}", first: 20) {
          nodes {
              ... on MediaImage {
                  id
                  image {
                      src 
                  }
              }
          }
      }
  }
  `;

  const variable = async () => {

    const response = await fetch(graphqlEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': accesPoint,
      },
      body: JSON.stringify({ query }),
    }, { mode: 'no-cors' })

    const data = await response.json()

    return data.data.files.nodes
    
  }    

  res.send(await variable());
})



app.listen(port, ()=>{
  console.log("server is running on port 3001")
})
