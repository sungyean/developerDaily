
import React from "react";
import {
	Card
	, CardBody
	, CardHeader
	, CardTitle
	, Row
	, Col
	, Button
	, Table
} from "reactstrap";
import "react-datepicker/dist/react-datepicker.css";
import HorizontalBar from "./BrtChart";
import { CSVLink, CSVDownload } from "react-csv";
import { max } from "moment";
import moment from 'moment';
let data =[];
let key = "";
let value = "";

class AnalysisResult extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			AnalysisResult : props.pState,
			dataName : props.dataName,
			seq : props.seq
		};
	}
	fileDownLoad(){
		let hpaiRole = JSON.parse(localStorage.getItem('hpaiRole'));
		let excelDn = 'X';
		for(var i = 0; i < hpaiRole.length; i++) {
			var roleCode = hpaiRole[i].roleCode;
			if(roleCode == 'web-000030') {
				excelDn = 'O'
			}
		}
		if(excelDn == 'X' ){
			alert('다운로드 권한이 없습니다');
			return false;
		} 
	}
	render() {
		let csvDownData = [];
		let text = "";
		if(this.props.pState.resultJson != undefined){
			let jsonData =this.props.pState.resultJson;
			const removeBackSlash = jsonData.replace(/\\/g,"");
			let resultJson = JSON.parse(removeBackSlash);
			let json_data = resultJson.data.result;

			console.log("this.props.pState",this.props.pState)
			key = Object.keys(json_data);
			value = Object.values(json_data);
			//CSV 파일 다운로드
			csvDownData.push(["family",this.props.pState.family])
			csvDownData.push(["tc",this.props.pState.tc])
			csvDownData.push(["lr",this.props.pState.lr])
			csvDownData.push(["bf",this.props.pState.bf])
			csvDownData.push(["#RESULT","독립변수","분석된 가중치(%)"])
			for(let i =0; i<key.length; i++){
				csvDownData.push(["",key[i],Math.round(value[i]*100)/100.0])
			}
			data = [];
			let maxNum = -1;
			//let roc =parseInt(this.props.pState.roc);
			let roc = Math.round(this.props.pState.roc*100)/100.0;
			for(let i =0; i<key.length; i++){				
				data.push(
					<tr>
						<th></th>
						<td>{key[i]}</td>
						<td>{Math.round(value[i]*100)/100.0}</td>
					</tr>
				)
				if (Math.max.apply(null,value) == value[i]) {
					maxNum = value[i];
					//roc true 일때 -> 숫자가 아닐떄
					if(isNaN(roc) == true){
						text = <div style={{fontWeight:"bold", fontSize:"20px" }}>{"가장 영향력 있는 인자는" +key[i] + "("+Math.round(maxNum*100)/100.0+")"+"입니다. Test data의 문제로 ROC(수신자 판단 특성) 분석이 불가능 합니다."}</div>
					}else{
						text = <div style={{fontWeight:"bold", fontSize:"18px" }}>{"가장 영향력 있는 인자는 " +key[i] + "("+Math.round(maxNum*100)/100.0+")"+"입니다. ROC(수신자 판단 특성)의 AUC(Area Under Curve:곡선 하단 면적)은"+roc+"입니다."}</div>
					}
				}
			}
		}else{
			return false
		}
		return (
			<Row>
				<Col lg="12">
					{text}
				</Col>
				<Col lg="6">
					<HorizontalBar pState={this.props.pState} dataName={this.props.dataName}/>
				</Col>
				<Col lg="6">
					<Card>
						<CardHeader>
							<CardTitle tag="h5" className="mb-0"></CardTitle>
						</CardHeader>
							<CardBody>
							<Table style={{whiteSpace: "nowrap"}} responsive>
								<tbody>
								<tr>
									<th></th>
									<td style={{fontWeight:"bold"}}>family</td>
									<td style={{fontWeight:"bold"}}>{this.props.pState.family}</td>
								</tr>
								<tr>
									<th></th>
									<td style={{fontWeight:"bold"}}>tc</td>
									<td style={{fontWeight:"bold"}}>{this.props.pState.tc}</td>
								</tr>
								<tr>
									<th></th>
									<td style={{fontWeight:"bold"}}>lr</td>
									<td style={{fontWeight:"bold"}}>{this.props.pState.lr}</td>
								</tr>
								<tr>
									<th></th>
									<td style={{fontWeight:"bold"}}>bf</td>
									<td style={{fontWeight:"bold"}}>{this.props.pState.bf}</td>
								</tr>
								<tr>
									<th style={{fontWeight:"bold"}}>#결과</th>
									<td style={{fontWeight:"bold"}}>독립변수</td>
									<td style={{fontWeight:"bold"}}>분석된 가중치</td>
								</tr>	
									{data}
								</tbody>
							</Table>
								<CSVLink uFEFF={false}  target="_blank" type="charset=utf-8" filename={this.props.dataName+"("+ moment(this.props.pState.endDttm).format('YYYY-MM-DD hh:mm:ss')+")"+".csv"} onClick={this.fileDownLoad.bind(this)} 
								data={csvDownData} >
									<Button className="float-right" type="button">결과 분석 CSV 파일다운로드</Button>
								</CSVLink>
						</CardBody>
					</Card>
				</Col>
			</Row>
		)
	}
}

export default AnalysisResult;