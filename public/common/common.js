commonUtils = {
    result:function(isSuccess,data){
        var result = {"isSuccess":isSuccess,"data":data}
        return Json.parse(result)
    }
}
