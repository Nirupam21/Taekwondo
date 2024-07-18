
const express = require('express')
const router = express.Router()
const Student = require("../models/sudent.model")
const puppeteer = require('puppeteer')
const ejs = require('ejs')

router.get('/', async(req,res) => {
       try{
            const students = await Student.find()
            //res.json(aliens)
            res.render("students",{students, message: null, title: "Home"})
       }catch(err){
            console.log('Error' + err)
       }
})

router.get('/new', async(req, res) => {
     res.render("new_student", {message: null, title: "Add"})
})

router.post('/', async(req, res) => {

     const student = new Student({
          name: req.body.name,
          gender: req.body.gender,
          weightCategory: req.body.weight,
          ageCategory: req.body.age,
          club: req.body.club,
     })

     try{
          const data = await student.save()
          const students = await Student.find()
          let message="Student Added Successfully!"
          let type = "success"
          //res.json(data)
          res.render("students",{students, message, type, title: "Home"})
     }catch(err){
          console.log(err)
          res.render("students",{students, message: "Could not add student! try again later", type: "danger", title: "Home"})
     }
})

router.get('/tournament', async(req, res) => {
     res.render("tournament", {message: null, title: "Tournament"})
})

router.post('/fixture', async(req, res) => {
     try{
          const gender = req.body.gender
          const weightCategory = req.body.weight
          const ageCategory = req.body.age
          const mode = req.body.mode
     
          const students = await Student.find({"gender": gender,
                                              "weightCategory": weightCategory,
                                             "ageCategory": ageCategory})
     
          const count = students.length
     
          if(mode == "Manual"){
               if(count == 2 || count == 4 || count == 8 || count == 16 || count == 32 || count == 64 || count == 128){
                    let browser
                    (async () => {
                         browser = await puppeteer.launch();
                         const [page] = await browser.pages();
                         const html = await ejs.renderFile("./views/fixture1_manual.ejs", {count, title: "Fixture", weightCategory, gender, ageCategory});
                         await page.setContent(html);
                         const pdf = await page.pdf({format: "A4"});
                         res.contentType("application/pdf");
                     
                         // optionally:
                         res.setHeader(
                           "Content-Disposition",
                           "attachment; filename=fixture.pdf"
                         );
                     
                         res.send(pdf);
                       })()
                         .catch(err => {
                           console.error(err);
                           res.sendStatus(500);
                         }) 
                         .finally(() => browser?.close())
          
                    //res.render("fixture1", {students, count, title: "Fixture", weightCategory, gender, ageCategory})
               }
               else if(count > 0){
                    let n = 0
                    if(count == 3){
                         n = 4
                    }
                    else if(count > 4 && count < 8){
                         n = 8
                    }
                    else if(count > 8 && count < 16){
                         n = 16
                    }
                    else if(count > 16 && count < 32){
                         n = 32
                    }
                    else if(count > 32 && count < 64){
                         n = 64
                    }
                    else if(count > 64 && count < 128){
                         n = 128
                    }
                    let browser
                    (async () => {
                         browser = await puppeteer.launch();
                         const [page] = await browser.pages();
                         const html = await ejs.renderFile("./views/fixture2_manual.ejs", {n, title: "Fixture", weightCategory, gender, ageCategory});
                         await page.setContent(html);
                         const pdf = await page.pdf({format: "A4"});
                         res.contentType("application/pdf");
                     
                         // optionally:
                         res.setHeader(
                           "Content-Disposition",
                           "attachment; filename=fixture.pdf"
                         );
                     
                         res.send(pdf);
                       })()
                         .catch(err => {
                           console.error(err);
                           res.sendStatus(500);
                         }) 
                         .finally(() => browser?.close())
          
                    // console.log(bye)
                    // console.log(notBye)
          
                    //res.render("fixture2", {notBye, bye, n, title: "Fixture", weightCategory, gender, ageCategory})
               }
               else{
                    res.render("tournament", {message: "Record Not Found!", type: "danger", title: "Tournament"})
                    //res.redirect("tournament")
               }

          }
          else if(mode == "Automatic"){
               let currentIndex = students.length;
     
               while (currentIndex != 0) {
          
                 let randomIndex = Math.floor(Math.random() * currentIndex);
                 currentIndex--;
          
                 [students[currentIndex], students[randomIndex]] = [
                   students[randomIndex], students[currentIndex]];
               }
          
               if(count == 2 || count == 4 || count == 8 || count == 16 || count == 32 || count == 64 || count == 128){
                    let browser
                    (async () => {
                         browser = await puppeteer.launch();
                         const [page] = await browser.pages();
                         const html = await ejs.renderFile("./views/fixture1.ejs", {students, count, title: "Fixture", weightCategory, gender, ageCategory});
                         await page.setContent(html);
                         const pdf = await page.pdf({format: "A4"});
                         res.contentType("application/pdf");
                     
                         // optionally:
                         res.setHeader(
                           "Content-Disposition",
                           "attachment; filename=fixture.pdf"
                         );
                     
                         res.send(pdf);
                       })()
                         .catch(err => {
                           console.error(err);
                           res.sendStatus(500);
                         }) 
                         .finally(() => browser?.close())
          
                    //res.render("fixture1", {students, count, title: "Fixture", weightCategory, gender, ageCategory})
               }
          
               else if(count > 0){
          
                    let bye = []
                    let notBye = []
                    let n = 0
                    if(count == 3){
                         n = 4
                    }
                    else if(count > 4 && count < 8){
                         n = 8
                    }
                    else if(count > 8 && count < 16){
                         n = 16
                    }
                    else if(count > 16 && count < 32){
                         n = 32
                    }
                    else if(count > 32 && count < 64){
                         n = 64
                    }
                    else if(count > 64 && count < 128){
                         n = 128
                    }
                    let b = n-count
                    let nb = count-b
                    students.forEach(students => {
                         if(nb > 0){
                              notBye.push(students)
                              nb--
                         }
                         else if(b > 0 && nb == 0){
                              bye.push(students)
                              b--
                         }
                    });
          
                    let browser
                    (async () => {
                         browser = await puppeteer.launch();
                         const [page] = await browser.pages();
                         const html = await ejs.renderFile("./views/fixture2.ejs", {notBye, bye, n, title: "Fixture", weightCategory, gender, ageCategory});
                         await page.setContent(html);
                         const pdf = await page.pdf({format: "A4"});
                         res.contentType("application/pdf");
                     
                         // optionally:
                         res.setHeader(
                           "Content-Disposition",
                           "attachment; filename=fixture.pdf"
                         );
                     
                         res.send(pdf);
                       })()
                         .catch(err => {
                           console.error(err);
                           res.sendStatus(500);
                         }) 
                         .finally(() => browser?.close())
          
                    // console.log(bye)
                    // console.log(notBye)
          
                    //res.render("fixture2", {notBye, bye, n, title: "Fixture", weightCategory, gender, ageCategory})
               }
               else{
                    res.render("tournament", {message: "Record Not Found!", type: "danger", title: "Tournament"})
                    //res.redirect("tournament")
               }

          }
           
     }catch(err){
          res.render("tournament", {message: "Could not generate fixture! Try again later", type: "danger", title: "Tournament"})
     }

})

router.get('/delete/:id', async(req,res) => {
        try{
            const data = await Student.findByIdAndDelete(req.params.id)
            const students = await Student.find()
            let message = "Student deleted successfully!"
            let type = "danger"
  
            res.render("students", {students, message, type, title: "Home"})
        }catch(err){
            console.log(err)
        }
})

router.get('/edit/:id', async(req,res) => {
     try{
          let student = await Student.findById(req.params.id)
          res.render("update_student", {student, title: "Update"})
     }catch(err){
          let message="Record not found!"
          let type = "danger"
          const students = await Student.find()
          res.render("students", {students, message, type, title: "Home"})
     }
})

router.post('/update/:id', async(req,res) => {
     try{
          const update = await Student.findByIdAndUpdate(req.params.id, {
               name: req.body.name,
               gender: req.body.gender,
               weightCategory: req.body.weight,
               ageCategory: req.body.age,
               club: req.body.club  
          })

          const students = await Student.find()
          let message = "Student updated successfully!"
          let type = "info"

          res.render("students", {students, message, type, title: "Home"})
     }catch(err){
          let message="Could not Update!"
          let type = "danger"
          const students = await Student.find()
          res.render("students", {students, message, type, title: "Home"})
     }
})

router.get("/search", async(req,res) => {
          res.render("search", {message: null, title: "Advanced Search"})
})

router.post('/category', async(req,res) => {

     try{
          const gender = req.body.gender
          const weightCategory = req.body.weight
          const ageCategory = req.body.age
     
          const students = await Student.find({"gender": gender,
                                              "weightCategory": weightCategory,
                                             "ageCategory": ageCategory})
          if(students.length == 0)
               res.render("search", {message: "Record Not Found!", type: "danger", title: "Advanced Search"})
          else
               res.render("result", {students, message:null, title: "Search Results"})
     }catch(err){
          res.render("search", {message: "Record Not Found!", type: "danger", title: "Advanced Search"})
     }
     
}) 

module.exports = router