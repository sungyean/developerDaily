
import React from "react";
import {
	Card
	, CardBody
	, CardHeader
	, CardTitle
	, Container
	, Form
	, Row
	, Col
	, InputGroup
	, CustomInput
	, Button
	, Input,
	InputGroupAddon,
	Modal,
	ModalHeader,
	ModalBody,
	Table,
	ModalFooter,
	FormGroup,
	Label,
} from "reactstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment';
import axios from "axios";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import Select from 'react-select';
let loginId = JSON.parse(localStorage.getItem('userInfo')).id; // 로그인 ID
let count = 0;
let tableColumns = [
	{
		dataField: "dataName",
		text: "작업명",
		sort: true
	},
	{
		dataField : "userName",
		text : "작업자",
		sort : true
	},
	{
		dataField: "regDttm",
		text: "등록일",
		sort: true
	},
	{
		dataField: "analysisResult",
		text: "분석결과",
		sort: true
	}
];
let tableData = [];
let pagenationOptions = {
    totalSize: 0,
    onSizePerPageChange: (sizePerPage, page) => { }
    , onPageChange: (page, sizePerPage) => { }
    , paginationShowsTotal: true
};
const DatePickerInput = ({ value, onClick }) => (
    <Input style={{height:'31px'}} onClick={onClick} size="18" value={value} placeholder="등록일을 입력하세요"/>
);
const options = [
    {
        value: 'dataName',
        label: '작업명'
	}, 
	{
        value: 'userName',
        label: '작업자'
    }
];
const loginName = JSON.parse(localStorage.getItem('userInfo')).name;
class MainBRT extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			tableData: [],
			onTableChange: this.handleTableChange,
			count:count,
			fileModalView : false,
			family : "",
			status : "",
			description: "",
			dataName : "",
			userName : "",
			regDttm : "",
			newDescription : "",
			trainData: "",
			testDataFile: "",
			searchConfirmDateFrom : '',
			searchConfirmDateTo : '',
			selectedOption: {
                value: 'dataName',
                label: '작업명'
			},
			schText : ""
		};
	}

	handleTableChange = (type, { page, sizePerPage, filters, sortField, sortOrder, cellEdit }) => {//this.state.description
		if((this.state.schText == '' || this.state.schText == null) && (this.state.searchConfirmDateFrom == ''|| this.state.searchConfirmDateTo == 'Invalid date')){
			this.componentDidMount(null, page, sizePerPage, filters, sortField, sortOrder, cellEdit);
		 }else{
			this.handleSearch(null, page, sizePerPage, filters, sortField, sortOrder, cellEdit);
		 }   
	}
	componentDidMount(type, page, sizePerPage, filters, sortField, sortOrder, cellEdit){
		let reqParams = "";
		if (!page) {page = 0;}
		if (page >= 1) {page = page - 1;}
		reqParams += "&page=" + page;
		if (!sizePerPage) {sizePerPage = 10;}
		reqParams += "&size=" + sizePerPage;
		if(sortField == undefined){reqParams += "&sort=seq,desc"}
		if (sortField != undefined && sortOrder != undefined) {reqParams += "&sort=" + sortField + "," + sortOrder;}
		fetch(global.brtAnalysisUrl+"/analysisReq/advSearch?tblAlias=analysisReqs&schColumns=status&schKeywords=4&columnTypes=NUMBER&columnFormats=null&comparisonOperators=NEQ&conditions=AND&schColumns=model&schKeywords=0&columnTypes=NUMBER&columnFormats=null&comparisonOperators=EQ&conditions=AND" + reqParams)
		.then(response => response.json()).then(json=>{
			tableData = [];
			if(json._embedded.analysisReqs != null){
				json._embedded.analysisReqs.forEach(analysisData=> {
					if(analysisData.loginId == loginId ||loginId == 'admin' ){
						tableData.push({
							seq : analysisData.seq,
							dataName : <a href={"./BrtDetailAnalysis?seq="+analysisData.seq}>{analysisData.dataName}</a>,
							userName : analysisData.userName,
							regDttm : analysisData.regDttm != null ?  moment(analysisData.regDttm).format('YYYY-MM-DD hh:mm:ss') : '-',
							analysisResult : analysisData.historyCnt != null ? analysisData.historyCnt+"개" : 0+"개"
						})
					}
				})
			}
			let pageNumber = json.page.totalElements    
			pagenationOptions.totalSize = pageNumber;
			this.setState({
				tableData : tableData,
				count : pageNumber,
				totalSize: pageNumber
			})
		})//fetch 종료
		
	}
	fileModalClick() {
		this.setState({
			fileModalView : true
		})
	}
	modalClose(){
		this.setState({
			trainData : "",
			testDataFile : "",
			fileModalView : false
		})
	}
	fileSubmit(e){
		e.preventDefault();
		if(this.state.dataName == ""){
			alert("데이터 명을 입력 하세요")
			return false;
		}
		if(this.state.newDescription == ""){
			alert("설명을 입력 하세요")
			return false;
		}
		if(this.state.trainData == "" || this.state.trainData==undefined){
			alert("train data 파일을 등록해 주세요")
			return false;
		}
		if(this.state.testDataFile == "" || this.state.testDataFile==undefined){
			alert("test data 파일을 입력 하세요")
			return false;
		}
		if(window.confirm(`입력하신 내용으로 저장하시겠습니까?`) == true){ //리액트에서는 window. 붙여야함
			const formData = new FormData();
			formData.append('trainDataFile',this.state.trainData);
			formData.append('testDataFile',this.state.testDataFile);
			formData.append('description',this.state.newDescription);
			formData.append('loginId',loginId);
			formData.append('dataName',this.state.dataName);
			formData.append('userName',loginName);
			formData.append('model','BRT');
			formData.append('family','');
			formData.append('lat','');
			formData.append('lng','');
			formData.append('regionCode','');

			axios.post(global.brtAnalysisUrl + '/analysis/brt/saveAnalysisReq' , formData)  .then((response) => {
				window.location.href="./BrtDetailAnalysis?seq=" + response.data.seq	
			})
			.catch(function (error) {
				if (error.response) {
					// The request was made and the server responded with a status code
					// that falls out of the range of 2xx
					alert("오류가 발생하였습니다\n------------------------\n"+ error.response.data.message);
				} else if (error.request) {
					// The request was made but no response was received
					// `error.request` is an instance of XMLHttpRequest in the browser and an instance of
					// http.ClientRequest in node.js
					alert("오류가 발생하였습니다\n------------------------\n"+ error.request);
				} else {
					// Something happened in setting up the request that triggered an Error
					alert("오류가 발생하였습니다\n------------------------\n"+ error.message);
				}
			});
		}else{
			return false;
		}
	}
	inputChange= (e) =>{
		this.setState({
			[e.target.name] : e.target.value
		})
	}
	handleSearch(type, page, sizePerPage, filters, sortField, sortOrder, cellEdit){
		let reqParams = ""; // 페이지 정보Param
		if (!page) {page = 0;}
		if (page >= 1) {page = page - 1;}
		reqParams += "&page=" + page;
		if (!sizePerPage) {sizePerPage = 10;}
		reqParams += "&size=" + sizePerPage;
		if(sortField == undefined){reqParams += "&sort=seq,desc"}
		if (sortField != undefined && sortOrder != undefined) {reqParams += "&sort=" + sortField + "," + sortOrder;}
		let url = global.brtAnalysisUrl + "/analysisReq/advSearch?tblAlias=analysisReqs&schColumns=status&schKeywords=4&columnTypes=NUMBER&columnFormats=null&comparisonOperators=NEQ&conditions=AND&schColumns=model&schKeywords=0&columnTypes=NUMBER&columnFormats=null&comparisonOperators=EQ&conditions=AND"
		let fromDate = moment(this.state.searchConfirmDateFrom).format('YYYYMMDD');
		let toDate = moment(this.state.searchConfirmDateTo).format('YYYYMMDD');
		if(fromDate == "Invalid date" || toDate == "Invalid date"){
			fromDate = ""
			toDate= ""
		}
		if(this.state.selectedOption.value == "dataName"){
			url += '&schColumns=dataName'+
			'&schKeywords=' + this.state.schText +
			'&columnTypes=STRING' +
			'&columnFormats=null&comparisonOperators=LK' +
			'&conditions=AND'
		}
		if(this.state.selectedOption.value == "userName"){
			url += '&schColumns=userName'+
			'&schKeywords=' + this.state.schText +
			'&columnTypes=STRING' +
			'&columnFormats=null&comparisonOperators=LK' +
			'&conditions=AND'
		}
		 //데이터 초기화.
		if(fromDate ==='Invalid date'){
        	fromDate = '';
       	}
       	if(toDate === 'Invalid date'){
        	toDate = '';
       	}
		if(fromDate != ""){
			url += '&schColumns=regDttm'+ 
			'&schKeywords=' + fromDate + ' 00:00:00.000000'+
			'&columnTypes=DATE' +
			'&columnFormats=yyyyMMdd%20HH:mm:ss.SSSSSS&comparisonOperators=GT' +
			'&conditions=AND'
		}
		if(toDate != ""){
			url += '&schColumns=regDttm'+ 
			'&schKeywords=' + toDate + ' 23:59:59.000999'+
			'&columnTypes=DATE' +
			'&columnFormats=yyyyMMdd%20HH:mm:ss.SSSSSS&comparisonOperators=LT' +
			'&conditions=AND'
		}
		 //+1을 안한값과 비교해야한다.
		 if(fromDate> moment(this.state.searchConfirmDateTo).format('YYYYMMDD')){
			alert("형식에 맞지 않는 날짜 입니다.");
			return false;
		 }

		axios.get(url+reqParams).then(response=> {			
			tableData= [];
			this.state.tableData = [];
			if(response.data._embedded.analysisReqs != null){
				response.data._embedded.analysisReqs.forEach(analysisData=> {
					if(analysisData.loginId == loginId ||loginId == 'admin' ){
						tableData.push({
							seq : analysisData.seq,
							dataName : <a href={"./BrtDetailAnalysis?seq="+analysisData.seq}>{analysisData.dataName}</a>,
							userName : analysisData.userName,
							regDttm : analysisData.regDttm != null ?  moment(analysisData.regDttm).format('YYYY-MM-DD hh:mm:ss') : '-',
							analysisResult : analysisData.historyCnt != null ? analysisData.historyCnt+"개" : 0+"개"
						})
					}
				})
			}
			let pageNumber = response.data.page.totalElements    
			pagenationOptions.totalSize = pageNumber;
			this.setState({
				tableData : tableData,
				count : pageNumber,
				totalSize: pageNumber
			})
		})
		
	}
	filehandleChange = (e) =>{
		this.setState({
			[e.target.name]: e.target.files[0]
		})
	}
	appKeyPress = (e) => {
        if(e.key === 'Enter'){
            this.handleSearch();
        }
	}
	setConfirmDateFrom = date => {
        this.setState({searchConfirmDateFrom: date});
    };
    setConfirmDateTo = date => {
        this.setState({searchConfirmDateTo: date});
	};
	selectHandleChange = selectedOption =>{
		this.setState({
			selectedOption
		})
	}
	render() {	
		var el = document.querySelector(".react-bootstrap-table.table-responsive > table");
		if(el) el.style.tableLayout = 'auto';
		const customStyles = {
            container: provided => ({
              ...provided,
              width: 150
              
            })
		};
		return (
			<Container fluid className="p-0">
				<h1 className="h3 mb-3">BRT</h1>
				<Row>
					<Col>
					<Card id="isSearchableCheck">
						<CardHeader>
							<CardTitle tag="h5" className="mb-0">
								검색옵션
							</CardTitle>
						</CardHeader>
						<CardBody style={{width:'auto'}} key="search_key">
							<Form inline>
								<FormGroup className="mb-2 mr-sm-2 mb-sm-0">
									<Select
										styles={customStyles} 
										menuPlacement="auto"
										menuPosition="fixed"
										name="searchBox"
										value={this.state.selectedOption}
										onChange={this.selectHandleChange.bind(this)}
										options={options}/>
								</FormGroup>
								<FormGroup className="mb-2 mr-sm-2 mb-sm-0">
									<Input 
										style={{height:"38px"}}
										type="text"
										placeholder="검색 조건을 입력하세요"
										name="schText"
										onChange={this.inputChange.bind(this)}
										onKeyPress={this.appKeyPress.bind(this)} 
									/>
								</FormGroup>
								<FormGroup className="mb-2 mr-sm-2 mb-sm-0">
									<Label className=''>등록일</Label>&nbsp;&nbsp;&nbsp;&nbsp;
									<DatePicker                                        
										selected={this.state.searchConfirmDateFrom}
										onChange={date => this.setConfirmDateFrom(date)}
										dateFormat="yyyy-MM-dd"
										showYearDropdown="showYearDropdown"
										showMonthDropdown="showMonthDropdown"
										maxDate={this.state.toDate}
										todayButton={'오늘'}
										customInput={<DatePickerInput />}
										dateRan="dateRan"/>
									~
									<DatePicker
										selected={this.state.searchConfirmDateTo}
										onChange={date => this.setConfirmDateTo(date)}
										dateFormat="yyyy-MM-dd"
										showYearDropdown="showYearDropdown"
										showMonthDropdown="showMonthDropdown"
										maxDate={this.state.toDate}
										todayButton={'오늘'}
										customInput={<DatePickerInput />}
										dateRan="dateRan"/>&nbsp;&nbsp;
								</FormGroup>
								<Button className="float-right btn-primary"  style={{backgroundColor : "#47BAC1",borderColor: '#47BAC1'}} onClick={this.handleSearch.bind(this)}>검색</Button>
							</Form>
						</CardBody>
					</Card>
					</Col>
				</Row>
				<Row>
					<Col>
						<Card>
							<CardHeader>
								<Button className="float-right"  onClick={this.fileModalClick.bind(this)} style={{marginLeft : '10px',backgroundColor : "#47BAC1",borderColor: '#47BAC1'}}>새 데이터 파일 올리기</Button>&nbsp;&nbsp;&nbsp;
								<CardTitle tag="h5">{this.state.totalSize ? "작업 목록 (총" + this.state.totalSize + "건)" : ""}</CardTitle>
							</CardHeader>
							<CardBody>
								<BootstrapTable 
								 remote
								 keyField="data"
								 classes="table-striped table-hover"
								 //rowEvents={rowEvents}
								 wrapperClasses="table-responsive text-nowrap"
								 data={this.state.tableData}
								 columns={tableColumns}
								 bootstrap4
								 bordered={false}
								 pagination={paginationFactory(pagenationOptions)}
								 paginationShowsTotal={true}
								 onTableChange={this.state.onTableChange}
								/>
							</CardBody>
						</Card>
					</Col>
					<Modal isOpen={this.state.fileModalView} key="fileModal">
						<Form onSubmit={this.fileSubmit.bind(this)}>
							<ModalHeader>
								데이터 파일 올리기
							</ModalHeader>
							<ModalBody>
								<Row>
									<Col>
										<Card>
											<CardHeader></CardHeader>
											<CardBody>
												<Table bordered responsive>
													<tbody>
														<tr>
															<th className="table-active" style={{verticalAlign:'middle', textAlign:'center' ,width: '100px'}}>데이터 명</th>
															<td>
																<Input type="text" placeholder="데이터명" name="dataName" value={this.state.dataName} onChange={this.inputChange.bind(this)}/>
															</td>
														</tr>
														<tr>
															<th className="table-active" style={{verticalAlign:'middle', textAlign:'center'}}>설명</th>
															<td>
																<Input type="textarea" name="newDescription" value={this.state.newDescription} onChange={this.inputChange.bind(this)} rows="8"/>
															</td>
														</tr>
														<tr>
															<th className="table-active" style={{verticalAlign:'middle', textAlign:'center'}}>train data</th>   
															<td>
																<input type="file" name="trainData" onBlur={this.filehandleChange.bind(this)}/>
															</td>
														</tr>
														<tr>
															<th className="table-active" style={{verticalAlign:'middle', textAlign:'center'}}>test data</th>   
															<td>
																<input type="file" name="testDataFile" onBlur={this.filehandleChange.bind(this)}/>
															</td>
														</tr>
													</tbody>
												</Table>
											</CardBody>
										</Card>
									</Col>
								</Row>
							</ModalBody>
							<ModalFooter>
								<Button type="submit" >파일 올리기</Button>
								<Button className="float-center" className="btn btn-primary" onClick={this.modalClose.bind(this)}>닫기</Button>
							</ModalFooter>
						</Form>
					</Modal>             
				</Row>
			</Container>
		)
	}
}
export default MainBRT;