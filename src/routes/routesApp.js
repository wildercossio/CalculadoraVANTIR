const express = require('express');
const router = express.Router();


router.get('/', (req, res) =>{
    res.render('index');
});

router.post("/add",(req,res)=>{
    let nroPeriodos=parseInt(req.body.nroPeriodos,10);
    let inversionInicial=parseInt(req.body.inversionInicial,10);
    let salvamento = parseInt(req.body.salvamento,10);
    let tasaDescuento = parseInt(req.body.tasaDescuento,10);
    //FNE
    let ingresosDato=parseInt(req.body.ingresos,10);
    let incrementoAnualIngresos = parseInt(req.body.incrementoAnualIngresos,10);
    let costosproduccion=parseInt(req.body.produccion,10);
    let costosAdministracion=parseInt(req.body.costosAdministracion,10);
    let costosVentas=parseInt(req.body.costosVentas,10);
    let depreciacion=(inversionInicial-salvamento)/nroPeriodos;
    let impuestos=parseInt(req.body.impuestos,10);

    const fne=new Array();
    const ingresos=new Array();
    ingresos.push(ingresosDato);

    for (let index = 0; index < nroPeriodos; index++) {

        ingresos.push(calcularIngresos(ingresos[index],incrementoAnualIngresos));
        let utilidadDeOperacion = ingresos[index]-costosproduccion-costosAdministracion-costosVentas;
        let utilidadAntesDeImpuestos = utilidadDeOperacion - depreciacion;

        let utilidadDelPeriodo = utilidadAntesDeImpuestos-impuestos;

        fne.push(utilidadDelPeriodo+depreciacion);
        
    }
    

    let sumaFNE=0;
    for (let index = 0; index < nroPeriodos; index++) {
        if (index==nroPeriodos-1) {
            sumaFNE = ((fne[index]+salvamento)/Math.pow((1+(tasaDescuento*0.01)),(index+1)))+sumaFNE; 
        } else {
            sumaFNE = ((fne[index])/Math.pow((1+(tasaDescuento*0.01)),(index+1)))+sumaFNE;
        }
        
    }
    
    let van = sumaFNE-inversionInicial; 
    let tir = calcularTIR(inversionInicial,fne,nroPeriodos,salvamento);
    res.render("respuesta",{van,fne,tir});
});

function calcularIngresos(ingresos,incremento){
    return (ingresos*(incremento*0.01))+ingresos;
}

function calcularTIR(inversionInicial,fne,nroPeriodos,salvamento){
    let valoresPara_i=new Array();
    let valoresVanPara_i = new Array();
    let i_random = 1;
    while (1) {
        let sumaFNE=0;
        for (let index = 0; index < nroPeriodos; index++) {
            if (index==nroPeriodos-1) {
                sumaFNE = ((fne[index]+salvamento)/Math.pow((1+(i_random*0.01)),(index+1)))+sumaFNE; 
            } else {
                sumaFNE = ((fne[index])/Math.pow((1+(i_random*0.01)),(index+1)))+sumaFNE;
            }
        } 
        let van = sumaFNE-inversionInicial;
        if(van>0){
            console.log("positivo");
            console.log(van);
            console.log(i_random);
            valoresVanPara_i.push(van)
            valoresPara_i.push(i_random);
            break;
        } 
        i_random = i_random + 1;
    }
    i_random = 1;
    while (1) {
        let sumaFNE=0;
        for (let index = 0; index < nroPeriodos; index++) {
            if (index==nroPeriodos-1) {
                sumaFNE = ((fne[index]+salvamento)/Math.pow((1+(i_random*0.01)),(index+1)))+sumaFNE; 
            } else {
                sumaFNE = ((fne[index])/Math.pow((1+(i_random*0.01)),(index+1)))+sumaFNE;
            }
        } 
        let van = sumaFNE-inversionInicial;
        if(van<0){
            console.log("negativo");
            console.log(van);
            console.log(i_random);
            valoresVanPara_i.push(van)
            valoresPara_i.push(i_random);
            break;
        }
        i_random = i_random + 1; 
    }

    let tir = (valoresPara_i[0]*0.01)+((valoresPara_i[1]*0.01)-(valoresPara_i[0]*0.01))*((valoresVanPara_i[0])/(valoresVanPara_i[0]-valoresVanPara_i[1]))
    return tir;
}

module.exports=router;