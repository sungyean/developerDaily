
import React from "react";
import {
  Card, 
  CardBody,
  CardHeader,
  CardTitle, 
  Container,
  Form,
  Row,
  Col,
  CustomInput,
  Button,
  Input,
	Modal,
	ModalHeader,
	ModalBody,
	Table,
	ModalFooter,
  Spinner,
} from "reactstrap";
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment';
import axios from "axios";
import NumberFormat from "react-number-format";
import BrtAnalysisResult from './BrtAnalysisResult'
import * as Icon from "react-feather";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
const params = new URLSearchParams(window.location.search);
const seq = params.get("seq");
let count = 0 ;
let tableColumns = [
  {
		dataField: "endDttm",
		text: "분석완료시간",
		sort: true
  },
  {
		dataField: "analysisButton",
		text: ""
  },
  {
		dataField: "status",
    text: "상태",
    sort: true
  },
	{
		dataField: "family",
		text: "family",
		sort: true
	},
	
	{
		dataField: "tc",
		text: "tc",
		sort: true
	},
	{
		dataField: "lr",
		text: "lr",
		sort: true
	},
	{
		dataField: "bf",
		text: "bf",
		sort: true
  },
  {
		dataField: "trash",
		text: "",
	}
];
let pagenationOptions = {
  totalSize: 0,
  sizePerPage : 5,
  onSizePerPageChange: (sizePer5Page, page) => { }
  , onPageChange: (page, sizePerPage) => { }
  , paginationShowsTotal: true
  , hideSizePerPage: true
};

class MainBRT extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
      displayData : [],
      BrtModalResultView : false,
      previewData : [],
      tc : "",
      lr : "0.01",
      bf : "",
      dataName : "",
      description : "",
      ModelAnsErr : "",
      tableData: [],
			onTableChange: this.handleTableChange,
      count:count,
      status : "",
      isVisible : false
    };
    this.analysisReqHistoryDelete.bind(this)
   
  }
  handleTableChange = (type, { page, sizePerPage, filters, sortField, sortOrder, cellEdit }) => {//this.state.description
		this.componentDidMount(null, page, sizePerPage, filters, sortField, sortOrder, cellEdit)
	}
  async componentDidMount(type, page, sizePerPage, filters, sortField, sortOrder, cellEdit){
    let reqParams = "";
		if (!page) {page = 0;}
    if (page >= 1) {page = page - 1;} 
    
		reqParams += "&page=" + page;
		if (!sizePerPage) {sizePerPage = 10;}
		reqParams += "&size=" + 5;
		if(sortField == undefined){reqParams += "&sort=seq,desc"}
    if (sortField != undefined && sortOrder != undefined) {reqParams += "&sort=" + sortField + "," + sortOrder;}
    fetch(global.brtAnalysisUrl+"/analysisReqHistory/advSearch?tblAlias=analysisReqHistories&schColumns=status&schKeywords=2&columnTypes=NUMBER&columnFormats=null&comparisonOperators=EQ&conditions=AND&schColumns=analysisReqSeq&schKeywords="+seq+"&columnTypes=NUMBER&columnFormats=null&comparisonOperators=EQ&conditions=AND" + reqParams).then(response => response.json())
    .then(json=>{
      let tableData = [];
      let Histories = [];
      if(json._embedded !=undefined){
        json._embedded.analysisReqHistories.forEach(analysisReqHistories =>{
          tableData.push({
            endDttm :  analysisReqHistories.endDttm != null ?  moment(analysisReqHistories.endDttm).format('YYYY-MM-DD hh:mm:ss') : '-',
            analysisButton : <Button onClick={this.BrtModalResult.bind(this)} data-index={analysisReqHistories.seq}>분석 결과</Button>,
            status : analysisReqHistories.status,
            family : analysisReqHistories.family,
            tc : analysisReqHistories.tc,
            lr : analysisReqHistories.lr,
            bf : analysisReqHistories.bf,
            trash : <Icon.Trash2 style={{cursor:"hand"}} onClick={() => this.analysisReqHistoryDelete(analysisReqHistories.seq)} />
          })
          Histories.push({
            analysisReqHistories : analysisReqHistories
          })
        })
      }
      let pageNumber = json.page.totalElements    
      pagenationOptions.totalSize = pageNumber;
      this.setState({
        analysisReqHistories : Histories,
        tableData : tableData,
        count : pageNumber,
        totalSize: pageNumber
        
      })
    })
  }
  BrtModalResult =(e) => {
    let index = e.target.getAttribute('data-index');
    let analysisReqHistories = "";
    for(let i=0; i<this.state.analysisReqHistories.length; i++){
      if(this.state.analysisReqHistories[i].analysisReqHistories.seq == index){
        analysisReqHistories = this.state.analysisReqHistories[i].analysisReqHistories
      }
    }
    let resultJson = analysisReqHistories.resultJson;
      if(resultJson == null){
				alert("분석 결과 데이터가 존재하지 않습니다.")
				return false;
      }
      
      if(analysisReqHistories.status == 'FAILED'){
        this.setState({
          ModelAnsErr : JSON.parse(resultJson).msg,
          ModelAnsErrModalShow : true
        })
        return false;
      }else{
        this.setState({
          newAnalysisData : analysisReqHistories,
          BrtModalResultView : true
        })
      }
  }

  async componentWillMount(){
      fetch(global.brtAnalysisUrl+"/analysisReqs/"+seq).then(response => response.json()).then(json =>{
        let previewData = ""; 
        let dataColumns = "";

        if(json.previewDataJson != undefined){
          const removeBackSlash = json.previewDataJson.replace(/\\/g,"");
          previewData = JSON.parse(removeBackSlash);
          dataColumns = json.dataColumns.split(",")
        }
        this.setState({
          previewData : previewData,
          family : json.family,
          tc : json.tc,
          lr : json.lr,
          bf : json.bf,
          dataName : json.dataName,
          description : json.description,
          elementCheckbox : new Set(),
        })
        for(let i =0; i < dataColumns.length; i++){
          let index = dataColumns[i];
          this.setState({
            ["checkBoxColumn"+index ] : true
          })
          this.state.elementCheckbox.add(index)
        }
        this.setState({
          radioBoxColumn : json.response  
        })
      })
    }
  	analysisRequest() {
      if(!(/^[0-9]+$/.test(this.state.tc) && parseInt(this.state.tc) > 0)){
          document.getElementById('tc').focus();
          alert("tc는 0초과,정수 조건이어야 합니다.");
          return false;
      }
      if(! (this.state.lr > 0 && /^[-]?\d+(?:[.]\d+)?$/.test(this.state.lr) &&  (this.state.lr <= 1)  )  ){
        document.getElementById('lr').focus();
        this.setState({
          lr : "0.01"
        })
        alert("lr는 0초과 1이하 실수 조건이어야 합니다.");
        return false;
      }
      if(! (this.state.bf > 0 && /^[-]?\d+(?:[.]\d+)?$/.test(this.state.bf) &&  (this.state.bf <= 1)  )  ){
        document.getElementById('bf').focus();
        alert("bf는 0초과 1이하 실수 조건이어야 합니다.");
        return false;
      }
      
      if(this.state.elementCheckbox.size == 0){
        alert("Element checkBox는 적어도 1개이상 체크해야 합니다.")
        return false;
      }
      // elementCheckbox 에서 서버로 전송할 수 있도록 commna 를 붙혀서 합침
      let numArray  = new Uint32Array(this.state.elementCheckbox)
      numArray.sort();
      let dataColumns = Array.from(numArray).join();
      let formData = {
        "seq" : seq,
        "family" : this.state.family,
        "tc" : this.state.tc,
        "lr" : this.state.lr,
        "bf" : this.state.bf,
        "response" : this.state["radioBoxColumn"],
        dataColumns 
      }
      console.log("formData",formData)
      this.setState({
        isVisible : true
      })
      
      axios.post(global.brtAnalysisUrl + '/analysis/brt/reqAnalysis' ,formData).then((response) => {
      
        let resultJson = response.data.resultJson;
        //.replace(/\n/g,"<br/>")
        if(response.data.status == 'FAILED'){
          this.setState({
            ModelAnsErr : JSON.parse(resultJson).msg,
            ModelAnsErrModalShow : true,
            isVisible : false
          })
          return false;
        }else{
          this.setState({
            newAnalysisData : response.data,
            BrtModalResultView : true,
            isVisible : false
          })
        }
        this.componentDidMount()
     })
     .catch(function (error) {
      if (error.response) {
				alert("오류가 발생하였습니다\n------------------------\n"+ error.response.data.message);
			} else if (error.request) {
				alert("오류가 발생하였습니다\n------------------------\n"+ error.request);
			} else {
				alert("오류가 발생하였습니다\n------------------------\n"+ error.message);
			}
			});
    }
    selectAllCheckBox = (e) =>{
      let checkBoxs = document.getElementsByName("checkBoxColumn");
      let index = this.state["radioBoxColumn"];
      for(let i=0; i<checkBoxs.length; i++){
        this.setState({
          ["checkBoxColumn"+(i+1)] : e.target.checked,
          ["checkBoxColumn"+index] : false
        })
        if(e.target.checked) {
          this.state.elementCheckbox.add((i+1).toString());
          
        } else {
          this.state.elementCheckbox.delete((i+1).toString());
        }        
        this.state.elementCheckbox.delete((index).toString());
      }
    }
    columCheckbox(e){
      let checkBoxId = e.target.id
      if(e.target.value == this.state["radioBoxColumn"]){
        alert("Response가 체크 되어 있습니다. Response와 Element를 동시에 선택할 수 없습니다.")
        this.setState({
          [checkBoxId] : false
        })
        this.state.elementCheckbox.delete(e.target.value)
        return false;
      }
      this.setState({
        [checkBoxId] : e.target.checked
      })
      if(e.target.checked) {
        this.state.elementCheckbox.add(e.target.value);
      } else {
        this.state.elementCheckbox.delete(e.target.value);
      }
    }
    radioBoxColumn(e){
      if(this.state["checkBoxColumn"+e.target.value] == true){
        this.setState({
          ["checkBoxColumn"+e.target.value] : false
        })
        this.state.elementCheckbox.delete(e.target.value)
      }      
      this.setState({
        [e.target.name] : e.target.value 
      })
    }
    BrtModalResultClose (){
      this.setState({
        BrtModalResultView : false
      })
    }
    inputChange = (e) => { 
      this.setState({
        [e.target.name] : e.target.value
      })
    }
    
    analysisModify(){
      this.setState({
        analysisModifyView : true
      })
    }
    analysisModifyClose(){
      this.setState({
        analysisModifyView : false
      })
    }
    analysisModifySubmit () {
      let data = {
        "seq" : seq,
        "dataName" : this.state.dataName,
        "description" : this.state.description
      }
      axios.put(global.brtAnalysisUrl+"/analysis/brt/updateAnalysis",data).then((response) => {
        
        //window.location.href = './BrtAnalysis'
        alert("수정 완료 되었습니다.");
        this.setState({
          analysisModifyView : false
        })

      }).catch(function (error) {
        if (error.response) {
          alert("오류가 발생하였습니다\n------------------------\n"+ error.response.data.message);
        } else if (error.request) {
          alert("오류가 발생하였습니다\n------------------------\n"+ error.request);
        } else {
          alert("오류가 발생하였습니다\n------------------------\n"+ error.message);
        }
      });
    }
    analysisDelete(){
      let data = {
        "seq" : seq,
        "status": "DELETED"
      }
      if(window.confirm(`삭제하시겠습니까? 모든 작업 내용이 삭제됩니다.`) == true){
        axios.put(global.brtAnalysisUrl+"/analysis/brt/updateAnalysis",data).then((response) => {
          window.location.href = './BrtAnalysis'
        }).catch(function (error) {
          if (error.response) {
            alert("오류가 발생하였습니다\n------------------------\n"+ error.response.data.message);
          } else if (error.request) {
            alert("오류가 발생하였습니다\n------------------------\n"+ error.request);
          } else {
            alert("오류가 발생하였습니다\n------------------------\n"+ error.message);
          }
        });
      }else{
        return false;
      }
    }
    analysisReqHistoryDelete(seq){
      let data = {
        "seq" : seq,
        "status": "DELETED"
      }
      if(window.confirm(`삭제하시겠습니까? 모든 작업 내용이 삭제됩니다.`) == true){
        axios.put(global.brtAnalysisUrl+"/analysis/brt/updateAnalysisReqHistory",data).then((response) => {
          
          this.componentDidMount();
          alert("삭제 되었습니다.");
          
        }).catch(function (error) {
          if (error.response) {
            alert("오류가 발생하였습니다\n------------------------\n"+ error.response.data.message);
          } else if (error.request) {
            alert("오류가 발생하였습니다\n------------------------\n"+ error.request);
          } else {
            alert("오류가 발생하였습니다\n------------------------\n"+ error.message);
          }
        });
      }else{
        return false
      }

    }
	render() {
    // 테이블 셀 내에서 줄넘김 방지 http://172.30.1.250:3001/issues/221
    // 최후의 방법임 : wrapperClasses에 text-nowrap을 추가하고 해당 테이블의 tableLayout 을 강제로 auto로 변경 -.- 
    var el = document.querySelector(".react-bootstrap-table.table-responsive > table");
    if(el) el.style.tableLayout = 'auto';
    let columCheckbox = [];
    let columRadiobox = [];
    let tableColum = [];   
    let columnData = [];
		for(let i =0; i<this.state.previewData.length; i++){     
      let brData = [];
      let obj_key =Object.keys(this.state.previewData[i]);
      for(let j=0; j<obj_key.length; j++){
        if(i == 0){
          columRadiobox.push(
            <td style={{textAlign:"center"}}>
              <CustomInput type="radio" name={"radioBoxColumn"} id={"radioBoxColumn"+(j+1)}  checked={this.state["radioBoxColumn"] == (j+1)} value={j+1} onChange={this.radioBoxColumn.bind(this)} /> 
            </td>
          ) 
          columCheckbox.push(
            <td style={{textAlign:"center"}}>
              <CustomInput type="checkbox" name="checkBoxColumn" id={"checkBoxColumn"+(j+1)} checked={this.state["checkBoxColumn"+(j+1)]} value={j+1} onChange={this.columCheckbox.bind(this)}/>
            </td>
          )
          tableColum.push(
            <td style={{textAlign:"center", fontWeight:"bolder" ,fontSize:"20px"}}>
              {obj_key[j]}
            </td>
          )
        }
        brData.push(
          <td style={{textAlign:"center"}}>{this.state.previewData[i][obj_key[j]]}</td>  
        )
      } 
      columnData.push(
        <tr>
          <th colSpan="2"></th>
          {brData}
        </tr>
      )
    }
    this.state.tableData.map(data => data.status =='REGISTERED'? data.status = '등록완료' :data.status =='ANALYSING'? data.status = '분석 중' : data.status =='SUCCESS'? data.status = '분석 성공' : data.status ='분석 실패')
		return (
      //onClick={this.imgClick.bind(this)}
			<Container fluid className="p-0">
				<Row>
          <Col lg="12">
            <a href="./BrtAnalysis"className="float-left"  style={{color:"#000", width:"200px"}}><Icon.CornerUpLeft style={{float:"left"}}/><h1 className="h3 mb-3">BRT 상세</h1></a>
            <Button className="float-right" type="button"  onClick={this.analysisDelete.bind(this)} style={{marginLeft : '10px',backgroundColor : "#47BAC1",borderColor: '#47BAC1'}}>작업 삭제</Button>
            <Button className="float-right" type="button"  onClick={this.analysisModify.bind(this)} style={{marginLeft : '10px',backgroundColor : "#47BAC1",borderColor: '#47BAC1'}}>작업 수정</Button>
          </Col>
					<Col lg="6">
            <Card id="isSearchableCheck">
              <CardHeader>
                <CardTitle tag="h5" className="mb-0">
                  옵션
                </CardTitle>
              </CardHeader>
              <CardBody style={{height:"400px", overflow:"scroll"}}>
                <Table bordered>
                    <tbody>
                      <tr>
                        <th className="table-active" style={{verticalAlign:'middle', textAlign:'center'}}>Family</th>
                        <td>
                          <Input className="mr-1" type="select" name="family" onChange={this.inputChange.bind(this)} value={this.state.family}>
                            <option value="BERNOULLI">BERNOULLI</option>
                            <option value="POISSON">POISSON</option>
                            <option value="LAPLACE">LAPLACE</option>
                            <option value="GAUSSIAN">GAUSSIAN</option>
                          </Input>
                          <text>{this.state.family =="POISSON" ? "Response가 자연수(개수)로 들어갈 경우 사용합니다." : this.state.family =="BERNOULLI"? "Logistic Regression의 경우로 Response에 0 아니면 1의 값만 넣어야 합니다." 
                          : this.state.family =="LAPLACE"? "Response가 실수로 주어질 경우 사용합니다. Loss를 최소화 하는 방법입니다." : "Response가 실수로 주어질 경우 사용합니다. Squared Error를 최소화 하는 방법입니다."}</text>
                        </td>
                      </tr>
                      <tr>
                        <th className="table-active" style={{verticalAlign:'middle', textAlign:'center'}}>tc</th>
                        <td>
                        <Input className="mr-1" type="text" name="tc" id="tc" onChange={this.inputChange.bind(this)} value={this.state.tc}></Input>
                        <text>{"Tree Complexity: BRT에서 사용하는 트리 복잡도로\n트리의 Depth와 같은 개념입니다."}</text>
                        </td>
                      </tr>
                      <tr>
                        <th className="table-active" style={{verticalAlign:'middle', textAlign:'center'}}>lr</th>
                        <td>
                          <Input className="mr-1" type="text" name="lr" id="lr" onChange={this.inputChange.bind(this)} value={this.state.lr}></Input>
                          <text>{"Learning Rate: 학습 효율입니다. 이 값이 크게되면 모델이 발산할 수 있습니다."}</text>
                        </td>
                      </tr>
                      <tr>
                        <th className="table-active" style={{verticalAlign:'middle', textAlign:'center'}}>bf</th>
                          <td>
                            <Input className="mr-1" type="text" name="bf" id="bf" onChange={this.inputChange.bind(this)} value={this.state.bf}></Input>
                            <text>{"Bag Fraction: 다음 단계 트리 생성을 위해 내부적으로 잡는 부분집합의 비율을 설정합니다."}</text>
                          </td>
                      </tr>
                    </tbody>
                  </Table>
              </CardBody>
            </Card>
					</Col>
					<Col lg="6">
            <Card>
              <CardHeader>
                <CardTitle tag="h5" className="mb-0">
                  분석결과 리스트
                </CardTitle>
              </CardHeader>
              <CardBody style={{height:"400px"}}>
                <BootstrapTable 
                  remote
                  keyField="data"
                  classes="table-striped table-hover"
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
				</Row>
        <div style={{whiteSpace : "nowrap"}}> 
          <Row>
            <Col>
              <Card>
                <CardHeader>
                  <Button className="float-right" type="submit"  onClick={this.analysisRequest.bind(this)} style={{marginLeft : '10px',backgroundColor : "#47BAC1",borderColor: '#47BAC1'}}>모델 분석 실행</Button>&nbsp;&nbsp;&nbsp;
                  <Modal isOpen={this.state.isVisible} size="sm" centered='true'>
                      <ModalHeader>
                          데이터 로딩 중입니다.잠시만 기다려 주십시오
                      </ModalHeader>
                      <ModalBody className="text-center m-3">
                          <Spinner key="1" color="secondary" size="md" className="mr-2" />
                      </ModalBody>
                      <ModalFooter>
                          {/*<Button color="secondary" onClick={() => this.state.toggle()}>닫기</Button>*/}
                      </ModalFooter>   
                  </Modal>
                </CardHeader>
                  <Row>
                      <Col>
                          <Card>
                              <CardHeader>
                              </CardHeader>								
                              <CardBody>
                              <Table responsive>
                                <tbody>
                                  <tr>
                                      <th colSpan="2">Response</th>
                                      {columRadiobox}
                                  </tr>
                                  <tr>
                                      <th>Element</th>
                                      <th><CustomInput type="checkbox" id="selectAllCheckBox" onChange={this.selectAllCheckBox.bind(this)}/></th>
                                      {columCheckbox}
                                  </tr>
                                  <tr>
                                    <th colSpan="2"></th>
                                    {tableColum}
                                  </tr>
                                      {columnData}
                                </tbody>
                              </Table>
                              </CardBody>
                          </Card>
                      </Col>
                  </Row>
              </Card>
            </Col>
            {/*모델 결과 분석  */}
            <Modal isOpen={this.state.BrtModalResultView} size="xl">
              <ModalHeader toggle={this.BrtModalResultClose.bind(this)}>BRT 분석 결과</ModalHeader>
              <ModalBody>
                <BrtAnalysisResult pState={this.state.newAnalysisData} seq={seq} dataName={this.state.dataName}/>
              </ModalBody>
              <ModalFooter>
                <Button className="float-center" className="btn btn-primary" onClick={this.BrtModalResultClose.bind(this)}>닫기</Button>
              </ModalFooter>
					  </Modal>

            {/*모델분석 실행 실패 모달창 */}
            <Modal isOpen={this.state.ModelAnsErrModalShow} size="sm" scrollable={true}>
                <ModalHeader>
                    모델 분석 실행 실패 에러 입니다. 
                </ModalHeader>
                <ModalBody className="m-3">
                  <div style={{whiteSpace:"pre-line"}}>
                    {this.state.ModelAnsErr}
                  </div> 
                </ModalBody>
                <ModalFooter>
                    <Button onClick={() => this.setState({ModelAnsErrModalShow : false})}>닫기</Button>
                </ModalFooter>   
            </Modal>

            {/*작업 수정 */}
            <Modal isOpen={this.state.analysisModifyView} key="analysisModify">
								<ModalHeader>
									작업 파일 수정
								</ModalHeader>
							  <Form>
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
																	<Input type="text" id="dataName" name="dataName" value={this.state.dataName} onChange={this.inputChange.bind(this)}/>
																</td>
															</tr>
															<tr>
																<th className="table-active" style={{verticalAlign:'middle', textAlign:'center'}}>설명</th>
																<td>
																	<Input type="textarea" name="description" value={this.state.description} onChange={this.inputChange.bind(this)} rows="8"/>
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
									<Button type="button" onClick={this.analysisModifySubmit.bind(this)}>수정</Button>
									<Button className="float-center" className="btn btn-primary" onClick={this.analysisModifyClose.bind(this)}>닫기</Button>
								</ModalFooter>
							</Form>
						</Modal>
          </Row>
        </div>
			</Container>
		)
	}
}

export default MainBRT;