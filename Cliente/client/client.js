let grpc = require("grpc");
let readline = require("readline");
let protoLoader = require("@grpc/proto-loader");

let proto = grpc.loadPackageDefinition(
    protoLoader.loadSync("../proto/vacaciones.proto",{
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    })
);

const REMOTE_URL = "0.0.0.0:50050";
let client = new proto.work_leave.EmployeeLeaveDaysService(REMOTE_URL,grpc.credentials.createInsecure());

var empleado = ({
    employee_id: 1,
    name: 'Diego Botia',
    accrued_leave_days: 10,
    requested_leave_days: 4
});

client.eligibleForLeave(empleado, (err,res) => {
    console.log(res.eligible);
    if(res.eligible){
        client.grantLeave(empleado, (err,resp)=>{console.log(
            "Granted: " + resp.granted +
            ", Accrued_leave_days: " + resp.accrued_leave_days +
            ", Granted_leave_days: " + resp.granted_leave_days)}
        )
    }else{
        console.log("Rejected Request")
    }
});