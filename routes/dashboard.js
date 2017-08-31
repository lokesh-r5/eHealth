/**
 * Created by lokesh on 11/24/2016.
 */
exports.patientDashboard = function (req,res) {
console.log("reqyest " +req.session.user );
    if(!req.session.user){
        res.send({statusCode:401});
    }

        res.render('patientDashBoard');

}