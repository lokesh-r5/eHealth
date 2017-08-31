/**
 * Created by lokesh on 11/30/2016.
 */
var message = require('../models/messageSchema');
exports.addMessage=function(req,res){
    console.log(req.body.doctorName);
    console.log(req.body.message);
    if(req.session.user.patientList){
        console.log('he is a doctor');
        var newMessage = message({
            from: req.session.user.name,
            to: req.body.patientName,
            message: req.body.message

        });
    }
    else{
        console.log('he is a patient');
        var newMessage = message({
            from: req.session.user.name,
            to: req.body.doctorName,
            message: req.body.message

        });
    }




    newMessage.save(function (err) {
        if(err) throw err;
        else console.log("Message Created");
    });
    //console.log(req.param("email"));
    res.send({statusCode:200});
};
exports.getMessages=function(req,res){
  message.find({to: req.session.user.name}, function (err, messages) {
      if(err) {
          console.log(err);
          res.send({statusCode:500});
      }
      else if(!messages){
          res.send({statusCode:404});
      }
      else {
          console.log(messages);
          res.send({statusCode:200,result:messages});
      }
  })
};
