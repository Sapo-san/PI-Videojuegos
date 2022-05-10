const { Router } = require('express');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');


const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

router.use("/", (req, res, next) => {
    res.status(200).send("<h1>Hello World</h1>")
    next()
})


module.exports = router;
