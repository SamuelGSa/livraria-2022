(async () => {
const express = require('express')
const app = express()
const db = require("./db.js")
const url = require("url")

const port = 8080

app.set('view engine','ejs')

app.use(express.static('livraria-2022'))
app.use("/books",express.static('books'))
app.use("/imgs",express.static('imgs'))
app.use("/css",express.static('css'))
app.use("/js",express.static('js'))

const consulta = await db.selectFilmes()
const consultaLivro = await db.selectLivros()

const consultaCarrinho = await db.selectCarrinho()

//console.log(consulta[0])
//console.log(consultaLivro[0])


app.get("/",(req,res) => {
    res.render(`index`, {
        titulo:"Conheça nossos livros", 
        promo:"Todos os livros com 10%OFF !",
        livro: consulta,
        galeria: consultaLivro
    })
})

app.get("/upd-promo",(req,res) => {
    res.render(`admin/atualiza-promocoes`, {
        titulo:"Conheça nossos livros", 
        promo:"Todos os livros com 10%OFF !",
        livro: consulta,
        galeria: consultaLivro
    })
})

app.get("/insere-livro",async(req,res) =>{
   await db.insertLivro({titulo:"Guerra Dos Mundos", resumo:"Lorem loren",valor:20.45,imagem:"guerra-dos-mundos.jpg"})
    res.send("<h2>livro Adicionado!</h2> <a href='./'>Voltar</a>")
})

app.get("/atualiza-promo",async(req,res) =>{
    let qs = url.parse(req.url,true).query
    await db.updatePromo(qs.promo,qs.id) //localhost:8080/atualiza-promo?promo=1&id=8
     res.send("<h2>Lista de Promoções Atualizadas!</h2> <a href='./'>Voltar</a>")
 })

app.get("/promocoes",async (req,res) => {
    const consultaPromo = await db.selectPromo()
    res.render(`promocoes`, {
        titulo:"Conheça nossos livros", 
        promo:"Todos os livros com 10%OFF !",
        livro: consulta,
        galeria: consultaPromo
    })
})


app.get("/single-produto",async(req,res) => {
    let infoUrl = req.url
    let urlProp = url.parse(infoUrl,true) // ?id=5
    let q = urlProp.query
    const consultaSingle = await db.selectSingle(q.id)
    const consultaInit = await db.selectSingle(4)


    res.render(`single-produto`, {
        titulo:"Conheça nossos livros", 
        promo:"Todos os livros com 10%OFF !",
        livro: consulta,
        galeria: consultaSingle,
        inicio: consultaInit
        })
})

app.get("/cadastro",async(req,res) => {
    let infoUrl = req.url
    let urlProp = url.parse(infoUrl,true) // ?id=5
    let q = urlProp.query
    const consultaSingle = await db.selectSingle(q.id)
    const consultaInit = await db.selectSingle(4)


    res.render(`cadastro`, {
        titulo:"Conheça nossos livros", 
        promo:"Todos os livros com 10%OFF !",
        livro: consulta,
        galeria: consultaInit
        })
})

app.get("/carrinho",(req,res) => {
    res.render(`carrinho`, {
        titulo:"Conheça nossos livros", 
        promo:"Todos os livros com 10%OFF !",
        livro: consulta,
        galeria: consultaLivro,
        carrinho: consultaCarrinho
    })
})

app.listen(port,() => console.log(`Servidor Rodando na porta ${port} com nodemon!`))
})()