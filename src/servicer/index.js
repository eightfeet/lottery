import request from "~/core/request";


export function apiTest(){
	return request.get('/mf/commonservice/api/provinces');
}
