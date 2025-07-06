import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import { log } from "node:console";
import { console } from "node:inspector";

const app = express();
const port = 3000;
const API_URL = "https://v6.exchangerate-api.com/v6";
const API_KEY = "20af7efe50d158fdff8c5178";

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/", (req,res)=>{
    res.render("index.ejs", {
        dataResult : "waiting for data.....",
        dataLastTimeUpdate: "...",
        dataBaseCode: "...",
        dataTargetCode: "...",
        dataConversionRate: "...",
        dataConversionResult: "...",
        
    });
});

app.post("/all-Currency", async(req,res)=>{

    try {
         const result = await axios.get(` ${API_URL}/${API_KEY}/latest/USD`);
          console.log("Result data :- ", result);
           res.render("index.ejs", { 
            dataResult: JSON.stringify(result.data.result),
            dataLastTimeUpdate: JSON.stringify(result.data.time_last_update_utc),
            dataBaseCode: JSON.stringify(result.data.base_code),
            dataTargetCode: JSON.stringify(result.data.target_code),
            dataConversionRate: JSON.stringify(result.data.conversion_rates),
            dataConversionResult: "Data will be displayed if your enter some amount to exchange.",
         });

        
    } catch (error) {
         res.render("index.ejs", { data: JSON.stringify(error.response.data) });
        // console.log(error);
    }
});

 app.post("/specific-Currency", async(req,res)=>{
            
            // console.log(baseCurrency);
            // console.log(targetCurrency);
        try {
            const baseCurrency = req.body.baseCurrency;
            const targetCurrency = req.body.targetCurrency;
            const userInputAmount = req.body.userInputCurrency;
            
            const result = await axios.get(`${API_URL}/${API_KEY}/pair/${baseCurrency}/${targetCurrency}/${userInputAmount}`);
            console.log(result);
            
            res.render("index.ejs", {
            dataResult: JSON.stringify(result.data.result),
            dataLastTimeUpdate: JSON.stringify(result.data.time_last_update_utc),
            dataBaseCode: JSON.stringify(result.data.base_code),
            dataTargetCode: JSON.stringify(result.data.target_code),
            dataConversionRate: JSON.stringify(result.data.conversion_rate),
            dataConversionResult: JSON.stringify(result.data.conversion_result),
            });

        } catch (error) {
            // this is the way to print the error but we have checked that there is no error so we simply send an error message using res.send here intead of res.render which is not required here for us. i.e why i have commented it.
            // res.render("index.ejs", { data: JSON.stringify(error.response.data) });
            res.send( "<h3> Incorrect Value  ! Try to enter a correct value. Like INR and check your inputs and Try again.</h3>" ,error);
        }
    });


app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
    
});
