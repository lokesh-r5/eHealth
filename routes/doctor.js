/**
 * Created by lokesh on 11/29/2016.
 */
exports.doctorDash=function (req,res) {
    console.log("in doctor"+ req.session.user);
    if(req.session.user) {

        res.render('doctorDash');
    }

}