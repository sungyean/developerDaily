import React, {Component} from "react";
import {
    Button,
    FormGroup,
    Card,
    CardBody,
    Col,
    Container,
    Row,
    CardTitle,
    CardHeader,
    Input,
    Label,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Table,
    Form,
    CustomInput,
    Spinner
} from "reactstrap";
import "react-datepicker/dist/react-datepicker.css";
import jQuery from "jquery";
import axios from "axios";
import Select from 'react-select';
import { toastr } from "react-redux-toastr";
import { Check } from "react-feather";
import { none } from "ol/centerconstraint";
const $ = jQuery;
window.jQuery = jQuery;
require("smartwizard/dist/js/jquery.smartWizard.min.js");

const urlParams = new URLSearchParams(window.location.search);
let seq = urlParams.get('hpaiTblMetaSeq');
let loginId = JSON.parse(localStorage.getItem('userInfo')).id; // 로그인 ID
const loginName = JSON.parse(localStorage.getItem('userInfo')).name;

//footer 미리보기 컬럼  (json형식을 통하여 컬럼명을 가지고 와서 push 할것)
//selectbox, inputbox, checkbox 동적 생성
//데이터 받아와서 select input checkbox를 넣는 로직!!
let columnNameOption = [];
let tdColumNameEnglish = []; //컬럼명(영어)
let tdColumType = []; //컬럼유형
let tdColumLength = []; //컬럼길이
let tdform = []; //형식
let tdColumNameKorea = []; //코멘트
let tdRequireCheck = []; //필수여부
let tdKeyCheck = []; //키여부
let tdSearchCheck = []; //검색기능
let tdSectionCheck = []; //구간검색
let tdLikeKeyword = []; //like키워드
let footColumnNameOption = [];
let footColumns = [];
let footTableData = [];
let footPreviewData = [];
//let tempRow = [];   //row 생성을 위해.

//step2 컬럼
let columnSeq = [];
let hpaiTblMetaSeq = [];
let columnName = [];
let columnType = [];
let columnLength = [];
let columnFormat = [];
let columnComment = [];
let isMandatory = [];
let isKey = [];
let isSearchable = [];
let isSearchableTerm = [];
let isLikeSearchable = [];


//step 2 데이터 미리보기 컬럼 가지고 오기. 
let TableSubmitUrl = "";
if (seq == null) {
    //신규 등록일 경우
    TableSubmitUrl = global.sdlApiUrl + '/sdl/metas/previewData';
} else {
    //기존 등록일 경우
    TableSubmitUrl = global.sdlApiUrl + '/sdl/metas/' + seq + '/previewData';
}
let sdlDataDetailUrl = "";
if(seq ==null){
    sdlDataDetailUrl = global.sdlApiUrl + "/sdl/metas"
}else {
    sdlDataDetailUrl = global.sdlApiUrl + "/sdl/metas/" + seq ;
}

class PreviewData extends React.Component {
    
    constructor(props) {
        super(props);
        this.handleChange = this .handleChange .bind(this);

        this.state = {
            title: "메타 미리보기",
            parentState: this.props.parentState
        }
    }

    handleChange = (e) => {
        let value = e.target.type === 'checkbox'? e.target.checked: e.target.value;
        var index = e.target.getAttribute('data-index');
        let tempChange = "";
        
        //키여부 필수여부는 따라 다녀야 한다.
        //키여부 ->primary key 필수여부 -> null or not null 
        for (let i = 0; i < columnSeq.length; i++) {
            if(e.target.name==["tdKeyCheck" + i] && e.target.checked == true){   
                this.props.parentChange(["tdRequireCheck" + i], true);   
            }else if(e.target.name==["tdKeyCheck" + i] && e.target.checked == false){
                this.props.parentChange(["tdRequireCheck" + i], false);
            }else if(e.target.name==["tdColumType" + i] && e.target.value == 'DATE'){
                this.props.parentChange(["tdform" + i], 'YYYY-MM-DD');
            }else if(e.target.name==["tdColumType" + i] && e.target.value == 'TIME'){
                this.props.parentChange(["tdform" + i], ' YYYY-MM-DD HH24:MI:SS');
            }
        }
        

        //신규 등록 할 때 
        if(seq == null && e.target.type=='select-one'){
            for(let i =0; i<this.props.parentState.columnName.length; i++){
                //e.target.value로 해야한다.
                if(this.props.parentState["tdColumNameEnglish" + i] === e.target.value){

                    //컬럼명
                    this.props.parentChange(["tdColumNameEnglish" + i], this.props.parentState[e.target.name]);

                    //컬럼 유형부터는 선택하지 않아도  컬럼명이 바뀌면 값이 바뀌어야한다....  
                    tempChange = this.props.parentState["tdColumType" + i];   
                    this.props.parentState["tdColumType" + i] = this.props.parentState["tdColumType" + index];      
                    this.props.parentState["tdColumType" + index] = tempChange;                                     
                    //this.props.parentChange('', this.props.parentState["tdColumType" + index]);

                    //컬럼 길이
                    tempChange = this.props.parentState["tdColumLength" + i]; //바뀌어야 하는 값.    
                    this.props.parentState["tdColumLength" + i] = this.props.parentState["tdColumLength" + index];      
                    this.props.parentState["tdColumLength" + index] = tempChange;          

                    //형식     
                    let tdfromI = (this.props.parentState["tdform" + i] === null) ? "" : this.props.parentState["tdform" + i];
                    let tdfromIndex = this.props.parentState["tdform" + index] === null ? "" : this.props.parentState["tdform" + index];    

                    tempChange = tdfromI;   
                    this.props.parentState["tdform" + i] = tdfromIndex;      
                    this.props.parentState["tdform" + index] = tempChange;                     
                    
                    //코멘트 tdColumNameKorea
                    let tdColumNameKoreaI = (this.props.parentState["tdColumNameKorea" + i] === null) ? "" : this.props.parentState["tdColumNameKorea" + i];
                    let tdColumNameKoreaIndex = this.props.parentState["tdColumNameKorea" + index] === null ? "" : this.props.parentState["tdColumNameKorea" + index];    

                    tempChange = tdColumNameKoreaI;   
                    this.props.parentState["tdColumNameKorea" + i] = tdColumNameKoreaIndex;      
                    this.props.parentState["tdColumNameKorea" + index] = tempChange;                      

                    //키여부 
                    tempChange = this.props.parentState["tdKeyCheck" + i]; 
                    this.props.parentState["tdKeyCheck" + i] = this.props.parentState["tdKeyCheck" + index];      
                    this.props.parentState["tdKeyCheck" + index] = tempChange;                                     

                    //필수 여부
                    tempChange = this.props.parentState["tdRequireCheck" + i];   
                    this.props.parentState["tdRequireCheck" + i] = this.props.parentState["tdRequireCheck" + index];      
                    this.props.parentState["tdRequireCheck" + index] = tempChange;     

                    //검색기능 
                    tempChange = this.props.parentState["tdSearchCheck" + i];   
                    this.props.parentState["tdSearchCheck" + i] = this.props.parentState["tdSearchCheck" + index];      
                    this.props.parentState["tdSearchCheck" + index] = tempChange;                                     

                    //구간검색
                    tempChange = this.props.parentState["tdSectionCheck" + i];   
                    this.props.parentState["tdSectionCheck" + i] = this.props.parentState["tdSectionCheck" + index];      
                    this.props.parentState["tdSectionCheck" + index] = tempChange;                                     

                    //footer Data
                    tempChange = this.props.parentState["tdFieldName" + i];   
                    this.props.parentState["tdFieldName" + i] = this.props.parentState["tdFieldName" + index];      
                    this.props.parentState["tdFieldName" + index] = tempChange;;

                    //like 키워드 검색 
                    tempChange = this.props.parentState["tdLikeKeyword" + i]; //바뀌어야 하는 값.    
                    this.props.parentState["tdLikeKeyword" + i] = this.props.parentState["tdLikeKeyword" + index];      
                    this.props.parentChange(["tdLikeKeyword" + index], tempChange);

                    break;
                }
            }
        }

        /*2. 자식에서 부모컴포넌트에 데이터 전달하는 방법.
        *    parent로 부터 받은 props인 onChange를 통해 value 값을 보냄.
        */

        this.props.parentChange([e.target.name], value);
    }

    inputOnblur = (e) => {
        if(e.target.value ===''){
            alert("필수 입력 값입니다. 컬럼길이를 입력 해주세요.")
            //컬럼길이 기본값 128
            e.target.value =128;
            this.props.parentChange([e.target.name], 128)

            return false;
        }
    }
    
    advancedSettingClick = (e) => {
        for(let i =0; i<10; i++){

            let advancedSetting =  document.getElementsByClassName("advancedSetting")[i];
            let advanceButton = document.getElementById("advancedButton");
            advancedSetting.style.display=="none" ? advanceButton.innerHTML="고급설정 숨기기" : advanceButton.innerHTML="고급설정 보기"
            advancedSetting.style.display=="none" ? advancedSetting.style.display="" : advancedSetting.style.display="none"
        }
    }

    render() {
        //값 초기화. 
        columnNameOption = [];
        footColumnNameOption = [];
        tdColumNameEnglish = [];
        tdColumType = [];
        tdColumLength = [];
        tdform = [];
        tdColumNameKorea = [];
        tdRequireCheck = []; 
        tdKeyCheck = []; 
        tdSearchCheck = [];
        tdSectionCheck = [];
        tdLikeKeyword = [];
        footColumns = [];
        footTableData = [];
        //데이터 받아와서 select input checkbox를 넣는 로직!!
        for (let i = 0; i < columnSeq.length; i++) {

            columnNameOption.push(<option value={this.props.parentState["tdColumNameEnglish" + i]} >{this.props.parentState["tdColumNameEnglish" + i]}</option>)
            footColumnNameOption.push(<option value={this.state.parentState["tdFieldName" + i]} >{this.state.parentState["tdFieldName" + i]}</option>)
            if(seq== null){
                tdColumNameEnglish.push(
                    <td>
                        <select onChange={this.handleChange} data-index={i} name={"tdColumNameEnglish" + i} style={{width :'100%'}} value={this.props.parentState["tdColumNameEnglish" + i]}>
                            {columnNameOption}
                        </select>
                    </td>
                );
            }else{
                tdColumNameEnglish.push(
                    <td>
                        <select disabled onChange={this.handleChange} data-index={i} name={"tdColumNameEnglish" + i} style={{width :'100%'}} value={this.props.parentState["tdColumNameEnglish" + i]}>
                            {columnNameOption}
                        </select>
                    </td>
                );

            }
            if(seq== null){
                tdColumType.push(
                    <td>
                        <select onChange={this.handleChange} name={"tdColumType" + i} id={"tdColumType" + i} style={{width :'100%'}} value={this.props.parentState["tdColumType"+i]}>
                            <option value="STRING">문자</option>
                            <option value="NUMBER">수치</option>
                            <option value="DATE">날짜</option>
                            <option value="TIME">시간</option>
                        </select>
                    </td>
                );
            }else{
                //DIGHT NUMBER로 변경.
                tdColumType.push(
                    <td>
                        <select disabled onChange={this.handleChange} name={"tdColumType" + i} id={"tdColumType" + i} style={{width :'100%'}} value={this.props.parentState["tdColumType"+i]}>
                            <option value="STRING">문자</option>
                            <option value="NUMBER">수치</option>
                            <option value="DATE">날짜</option>
                            <option value="TIME">시간</option>
                        </select>
                    </td>
                );

            }
   
            tdColumLength.push(
                <td>
                    <input
                        style={{width : '100%'}}
                        type="text" 
                        name={"tdColumLength" + i}
                        onChange={this.handleChange}
                        onBlur = {this.inputOnblur.bind(this)}
                        value={this.props.parentState["tdColumLength" + i]}/>
                </td>
            );

            tdform.push(
                <td>
                    <input
                        style={{width : '100%'}}
                        type="text"
                        name={"tdform" + i}
                        id = {"tdform" + i}
                        onChange={this.handleChange}
                        value={this.props.parentState["tdform" + i]}
                        maxLength="60"
                        />
                </td>
            );

            tdColumNameKorea.push(
                <td>
                    <input
                        style={{width : '100%'}}
                        type="text"
                        name={"tdColumNameKorea" + i}
                        onChange={this.handleChange}
                        value={this.props.parentState["tdColumNameKorea"+i]}
                        id =  {"ColumNameKoreaVaildation" + i}
                        maxLength="20"
                        />
                </td>
            );
                    
            tdKeyCheck.push(
                <td>
                    <center>
                        <CustomInput
                            style={{width : '100%'}}
                            type="switch"
                            onChange={this.handleChange}
                            id={"tdKeyCheck" + i}
                            name={"tdKeyCheck" + i}
                            checked={this.props.parentState["tdKeyCheck" + i]}/>
                    </center>
                </td>
            )
            if(this.props.parentState["tdKeyCheck"+i] == true){
                tdRequireCheck.push(
                    <td>
                        <center>
                        <CustomInput
                            style={{width : '100%'}}
                            type="switch"
                            id={"tdRequireCheck" + i}
                            name={"tdRequireCheck" + i}
                            onChange={this.handleChange}
                            checked={this.props.parentState["tdRequireCheck" + i]} disabled/>
                        </center>    
                    </td>
                )

            }else{    
                tdRequireCheck.push(
                    <td>
                        <center>        
                            <CustomInput
                                style={{width : '100%'}}
                                type="switch"
                                id={"tdRequireCheck" + i}
                                name={"tdRequireCheck" + i}
                                onChange={this.handleChange}
                                checked={this.props.parentState["tdRequireCheck" + i]}/>
                        </center>    
                    </td>
                )
            }

            tdSearchCheck.push(
                <td>
                    <center>
                        <CustomInput
                            style={{width : '100%'}}
                            type="switch"
                            id={"tdSearchCheck" + i}
                            name={"tdSearchCheck" + i}
                            onChange={this.handleChange}
                            checked={this.props.parentState["tdSearchCheck" + i]}/>
                    </center>
                </td>
            )
           

            tdSectionCheck.push(
                <td> 
                    <center>
                        <CustomInput
                            style={{width : '100%'}}
                            type="switch"
                            id={"tdSectionCheck" + i}
                            name={"tdSectionCheck" + i}
                            onChange={this.handleChange}
                            checked={this.props.parentState["tdSectionCheck" + i]}/>
                    </center>  
                </td>
            )

            tdLikeKeyword.push(
                <td>   
                    <center>
                        <CustomInput
                            style={{width : '100%'}}
                            type="switch"
                            id={"tdLikeKeyword" + i}
                            name={"tdLikeKeyword" + i}
                            onChange={this.handleChange}
                            checked={this.props.parentState["tdLikeKeyword" + i]}/>
                    </center>
                </td>
            )

            if(seq == null){
                footColumns.push(
                    <td>
                        <select disabled onChange={this.handleChange}  name={"tdFieldName" + i} style={{width :'100%'}} value={this.props.parentState["tdFieldName" + i]}>
                            {footColumnNameOption}
                        </select>
                    </td>
                )
            }else{
                footColumns.push(
                    <td>
                        <select onChange={this.handleChange}  name={"tdFieldName" + i} style={{width :'100%'}} value={this.props.parentState["tdFieldName" + i]}>
                            {footColumnNameOption}
                        </select>
                    </td>
                )

            }
        } //for문 종료
        let tempRow = [];  
       for(let j=0; j<this.props.parentState.footPreviewData.length; j++){        
            //step 2 미리보기
            tempRow = [];  
            for(let i=0 ; i < columnName.length ; i++){                                    
                tempRow.push(
                    <td>
                        <div style={{width:'200px',overflow:'hidden',textOverflow:'ellipsis', float:'left'}}>
                            {this.props.parentState.footPreviewData[j][this.props.parentState["tdColumNameEnglish" + i]]}
                        </div>
                    </td>
                )
            }
            footTableData.push(
                <tr>
                    {tempRow}
                </tr>
            )   
        }  

        return (
            <Container fluid className="p-0">
                <Row>
                    <Col>
                        <Card>
                            <CardHeader><br></br>
                                <CardTitle tag="h5">항목</CardTitle>
                                <Button type="button" id="advancedButton" color="primary" style={{float:"right"}} onClick={this.advancedSettingClick.bind(this)}>고급설정 보기</Button>
                                {/*<Button type="button" id="previewButton" color="primary" style={{float:"right", marginRight:"7px"}} onClick={this.defaultSettingClick.bind(this)}>일반설정</Button>*/}
                                <h6 className="card-subtitle text-muted">
                                    데이터 미리보기
                                </h6>
                                
                            </CardHeader>
                            <CardBody style={{overflowX : "auto",whiteSpace: "nowrap",  }}> 
                                <Table bordered>
                                    <tbody>
                                        <tr style={{display : "none"}} className="advancedSetting">
                                            <th className="table-active" style={{verticalAlign:'middle', textAlign:'center'}}>컬럼명</th>
                                            {tdColumNameEnglish}
                                        </tr>
                                        <tr style={{display : "none"}} className="advancedSetting">
                                            <th className="table-active" style={{verticalAlign:'middle', textAlign:'center'}}>컬럼 유형</th>
                                            {tdColumType}
                                        </tr>
                                        <tr style={{display : "none"}} className="advancedSetting">
                                            <th className="table-active" style={{verticalAlign:'middle', textAlign:'center'}}>컬럼 길이</th>
                                            {tdColumLength}
                                        </tr>
                                        <tr style={{display : "none"}} className="advancedSetting">
                                            <th className="table-active" style={{verticalAlign:'middle', textAlign:'center'}}>형식</th>
                                            {tdform}
                                        </tr>
                                        <tr style={{display : "none"}} className="advancedSetting">
                                            <th className="table-active" style={{verticalAlign:'middle', textAlign:'center'}}>코멘트</th>
                                            {tdColumNameKorea}
                                        </tr>
                                        <tr style={{display : "none"}} className="advancedSetting">
                                            <th className="table-active" style={{verticalAlign:'middle', textAlign:'center'}}>키여부</th>
                                            {tdKeyCheck}
                                        </tr>
                                        <tr style={{display : "none"}} className="advancedSetting">
                                            <th className="table-active" style={{verticalAlign:'middle', textAlign:'center'}}>필수 여부</th>
                                            {tdRequireCheck}
                                        </tr>
                                        <tr style={{display : "none"}} className="advancedSetting">
                                            <th className="table-active" style={{verticalAlign:'middle', textAlign:'center'}}>검색기능</th>
                                            {tdSearchCheck}
                                        </tr>
                                        <tr style={{display : "none"}} className="advancedSetting">
                                            <th className="table-active" style={{verticalAlign:'middle', textAlign:'center'}}>구간검색</th>
                                            {tdSectionCheck}
                                        </tr>
                                        <tr style={{display : "none"}} className="advancedSetting">
                                            <th className="table-active" style={{verticalAlign:'middle', textAlign:'center'}}>like키워드 검색</th>
                                            {tdLikeKeyword}
                                        </tr>
                                        <tr>
                                            <th rowSpan={this.props.parentState.footPreviewData.length+1} className="table-active" style={{verticalAlign:'middle', textAlign:'center'}}><center>데이터</center></th>
                                            {footColumns}
                                        </tr>
                                            {footTableData}
                                    </tbody>
                                </Table>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                {/*<button onClick={this.props.closePreview}>close me</button>*/}
            </Container>
        );
    }
}

class WizardVariant extends React.Component { //step class
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            title: "데이터 마트 등록",
            showPreview: null,
            // step1 유효성 검사
            dataName: "",
            tblName: "",
            description: "",
            isPublic: false,    // sdl로 탑재되는 모든 데이터는 기본적으로 비공개임
            file: "",
            //step3 유효성 검사.
            dataDeleteSave : false,
            stopWork : true,
            datadelete : false,
            isVisible : false
        }
        
    }

    changeState = (name, val) => {
        this.setState({
            [name]: val
        });
    }

    filehandleChange = (e) => {   
        this.setState({
            fileName: e.target.files[0],
            //fileName : e.target.value
        });
    }
    
    componentWillUnmount() {	//언마운트시 호출하는 메소드... 컴포넌트가 DOM에서 제거되기 직전에 호출되는 메서드. 타어머 제거/데이터구독해제
		toastr.removeByType("info");		//info 타입일 경우에만 삭제... 
    }
    
    //데이터 미리보기
    previewButtonOnClik(e) {
        if(this.state.showPreview == true){
            if(window.confirm("데이터를 다시 읽어오시겠습니까? 현재 설정된 컬럼 정보는 리셋됩니다") == false){

                return false;
            }
        }
        //기존 tosatr제거.
        toastr.removeByType("info"); 
        //selectbox inputbox checkbox 초기화.
        columnNameOption = [];
        footColumnNameOption = [];
        tdColumNameEnglish = [];
        tdColumType = [];
        tdColumLength = [];
        tdform = [];
        tdColumNameKorea = [];
        tdKeyCheck = [];
        tdRequireCheck = [];
        tdSearchCheck = [];
        tdSectionCheck = [];
        tdLikeKeyword = [];
        footColumns = [];
        footTableData = [];
    
        //데이터 초기화. 
        columnSeq = [];
        hpaiTblMetaSeq = [];
        columnName = [];
        columnType = [];
        columnLength = [];
        columnFormat = [];
        columnComment = [];
        isMandatory = [];
        isKey = [];
        isSearchable = [];
        isSearchableTerm = [];
        isLikeSearchable = [];
        footPreviewData= [];

        //미리보기를 제일먼저 클릭할 경우.
        const formData = new FormData();
        formData.append('file', this.state.fileName);
        const toastrOptions = {	//진행바 옵션.
			barTitle: "데이터 로딩 중입니다", 
			message: "잠시만 기다려 주십시오",
			type: "info",					  			
			showCloseButton: false,			  
			progressBar: true,				  
			position: "top-center",			  
            id: 'toast-container',
            preventDuplicates : false,
            timeOut :false

        };

        this.setState({
            isVisible: true
        });

        //toastr.info(toastrOptions.barTitle,toastrOptions.message,toastrOptions);	//light
        //step2 데이터 미리보기 가져오기. 
        return axios.post(TableSubmitUrl, formData)
                .then(response => {
                    response.data.hpaiTblMetaColumns.content
                        .forEach(tempHpaiTblMetaColumn => {
                            columnSeq.push(tempHpaiTblMetaColumn.seq);
                            hpaiTblMetaSeq.push(tempHpaiTblMetaColumn.hpaiTblMetaSeq);
                            columnName.push(tempHpaiTblMetaColumn.columnName);
                            columnType.push(tempHpaiTblMetaColumn.columnType);
                            columnLength.push(tempHpaiTblMetaColumn.columnLength);
                            columnFormat.push(tempHpaiTblMetaColumn.columnFormat);
                            columnComment.push(tempHpaiTblMetaColumn.columnComment);
                            isMandatory.push(tempHpaiTblMetaColumn.isMandatory);
                            isKey.push(tempHpaiTblMetaColumn.isKey);
                            isSearchable.push(tempHpaiTblMetaColumn.isSearchable);
                            isSearchableTerm.push(tempHpaiTblMetaColumn.isSearchableTerm);
                            isLikeSearchable.push(tempHpaiTblMetaColumn.isLikeSearchable);
                        });
                        for(let i=0 ; i<columnSeq.length ; i++){
                            this.setState({
                                ["tdColumNameEnglish" + i] : columnName[i],
                                ["tdColumType" + i] :  columnType[i],
                                ["tdColumLength" + i] : columnLength[i],
                                ["tdform" + i] : columnFormat[i],
                                ["tdColumNameKorea"+i] : columnComment[i],
                                ["tdRequireCheck" + i] : isMandatory[i],
                                ["tdKeyCheck" + i] : isKey[i],
                                ["tdSearchCheck" + i] : isSearchable[i],
                                ["tdSectionCheck" + i] : isSearchableTerm[i],
                                ["tdLikeKeyword" + i] : isLikeSearchable[i],
                                ["tdFieldName"+ i] : columnName[i]
                            })                            
                        }

                        //step2 미리보기 VIEW 
                        response.data.datum.forEach(tempDatum => {
                            footPreviewData.push(tempDatum);
                        })
                        //step2 저장 
                        this.setState({                                   
                            //showPreview: !this.state.showPreview,
                            showPreview: true,
                            footPreviewData: footPreviewData,
                            serverfileName : response.data.fileName,
                            columnName: columnName,
                            isVisible : false
                        });
                       toastr.removeByType("info");    
                })
                .catch(error => {
                    if (error.response) {
                      // The request was made and the server responded with a status code
                      // that falls out of the range of 2xx
                      alert("오류가 발생하였습니다. 관리자에게 문의하여 주시기 바랍니다.\n[오류내용]\n"+"(응답의 "+error.response.data.message+" 내용을 출력해주세요.)");
                      
                      
                    } else if (error.request) {
                      // The request was made but no response was received
                      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                      // http.ClientRequest in node.js
                      alert("오류가 발생하였습니다. 관리자에게 문의하여 주시기 바랍니다.\n[오류내용]\n"+"(응답의 "+error.request+" 내용을 출력해주세요.)");
                      
                    } else {
                      // Something happened in setting up the request that triggered an Error
                      alert("오류가 발생하였습니다. 관리자에게 문의하여 주시기 바랍니다.\n[오류내용]\n"+"(응답의 "+error.message+" 내용을 출력해주세요.)");
                      
                    }
                    this.setState({
                        isVisible : false
                    })
                  });
    };

    componentDidMount() {
        //step1 
        //기존테이블에 추가하는경우(데이터명, 테이블명, 설명, 공개여부 가지고 오기.)
        if (seq != null) {
            fetch(sdlDataDetailUrl)
                .then(response => response.json())
                .then(data => {
                    if (data !== undefined) { //json 형식의 값이 없을 땐 출력하지 않는다.
                        this.setState({
                            seq: data.seq,
                            dataName: data.dataName,
                            tblName: data.tblName,
                            dataRowCnt: data.dataRowCnt,
                            isPublic: data.isPublic, //공개여부
                            dataProvider: data.dataProvider,
                            dataCreateDt: data.dataCreateDt,
                            dataModiDt: data.dataModiDt,
                            status: data.status,
                            description: data.description
                        })
                    }
                }) //fatch  끝부분.
        }
        //다음이전 버튼.... but 적용이 안됨..
        $(this.refs.smartwizard)
            .smartWizard({
                theme: 'default', // default OR arrows
                transitionEffect: 'silde',
                showStepURLhash: false,
                toolbarSettings: {
                    //toolbarExtraButtons: [$('<button class="btn btn-submit btn-primary" type="submit">Finish</button>')]
                }
            }).on("leaveStep", function (e, anchorObject, stepNumber, stepDirection) {

                //valuedation check
                if (stepDirection === "forward") {
                   
                    if($('#dataName').val() == '' ){
                        $('#dataName').focus();
                        alert("데이터명은 필수 입력값입니다.");
                        return false;
                    }
                    if($('#tblName').val() == ''){
                        $('#tblName').focus();
                        alert("테이블명은 필수 입력값입니다.");
                        return false;
                    }
                    if($('#description').val() == ''){
                        $('#description').focus();
                        alert("설명은 필수 입력값입니다.");
                        return false;
                    }               
                }

                //step1 테이블명 중복확인 로직.
                if(seq ==null) {
                    if(stepNumber =='0' && stepDirection === "forward"){

                        let checkNext = '';
                        let tblNameText = $('#tblName').val();
                        $.ajax({
                            url: global.dmApiUrl + "/hpaiTblMetas/search/findByTblAlias?tblAlias="+tblNameText,
                            type: "get",
                            dataType: "json",
                            data: "",
                            success: function(data){
                                return checkNext = data._embedded.hpaiTblMetas.length;
                            },

                            //ajax는 비동기식 이므로...  결과를 기다리지 않고 바로 하단의 코드가 실행되기 때문에 async false하면 처리결과가 모두 완료된 후에 진행...(동기방식)
                            async:false

                        });

                        if(checkNext != 0 ){
                            $('#tblName').val(" ") 
                            alert("동일한 테이블이 존재합니다.")
                            return false;
                        }                   
                    }
                }
                
                //step2 파일필수 입력값 확인.
                $('#previewButton').click(function(){
                    let count =0;
                    count++; 
                    $('#previewButtonCount').val(count);  

                })
                
                if(stepNumber =='1' && stepDirection === "forward"){
                    
                    //파일 유효성 검사. 
                    if($('#fileName').val() == ''){
                        $('#fileName').focus();
                        alert("파일은 필수 입력값입니다.");
                        return false;
                    }
                    //미리보기 유효성 검사. 
                   let previewcount = $('#previewButtonCount').val();
                    if(previewcount == 0 || previewcount == ''){
                        alert("미리보기를 클릭하여 데이터를 작성해주세요.")
                        return false;
                    }
                    
                   //코멘트 필수 입력값.
                    for(let i=0; i<$("[id^='ColumNameKoreaVaildation']").length; i++){
                        
                        if($('#ColumNameKoreaVaildation'+i).val() == ''){
                            $('#ColumNameKoreaVaildation'+i).focus();
                            alert("코멘트는 필수 입력값입니다.");
                            return false;
                        }
                        
                        if($("#tdColumType"+i).find("option:selected").val() == 'DATE'){
                            if($('#tdform'+i).val() == ''){
                                $('#tdform'+i).focus();
                                alert("컬럼 유형이 날짜일 경우 형식은 필수 입력값 입니다.");
                                return false;

                            }
                        }
                        if($("#tdColumType"+i).find("option:selected").val() == 'TIME'){
                            if($('#tdform'+i).val() == ''){
                                $('#tdform'+i).focus();
                                alert("컬럼 유형이 시간일 경우 형식은 필수 입력값 입니다.");
                                return false;

                            }
                        }
                    }
                }
            });
            $(this.refs.smartwizard).find(".sw-btn-prev").html('이전')    
            $(this.refs.smartwizard).find(".sw-btn-next").html('다음')
            $(this.refs.smartwizard).find(".btn-submit").on("click", function () {
                    //alert("Great! The form is ready to submit.");
                    // Final validation
                    return false;
                });
    }

    handleChange = (e) => {
        
        const value = e.target.type === 'checkbox'? e.target.checked: e.target.value;

        this.setState({
            [e.target.name]: value
        })
        
    }

    handleSubmit = (e) => {
        e.preventDefault();

        if(window.confirm(`입력하신 내용으로 저장하시겠습니까?`) == true){ //리액트에서는 window. 붙여야함
        //step3 값!! 
        const hpaiTblMetaHistories = [{
            "fileName" : this.state.serverfileName,
            "deleteOldData" : this.state.dataDeleteSave,    //기존데이터 삭제 후 저장. 
            "stopOnError" : this.state.stopWork,            //작업중지 
            "deleteDataOnError" : this.state.datadelete,    //데이터 삭제 

        }]

        //컬럼 배열값 만들기!!! 
        let hpaiTblMetaColumns=[];

        for (let i = 0; i < columnSeq.length; i++) {
            hpaiTblMetaColumns.push({
                "columnName" : this.state['tdColumNameEnglish'+i],
                "fieldName" : this.state["tdFieldName" + i],
                "columnType" : this.state['tdColumType'+i],
                "columnLength" : this.state['tdColumLength'+i],
                "columnFormat" : this.state['tdform'+i],
                "columnComment" : this.state['tdColumNameKorea'+i],
                "isKey" : this.state["tdKeyCheck" + i],
                "isMandatory": this.state['tdRequireCheck'+i],
                "isSearchable" : this.state["tdSearchCheck" + i],
                "isSearchableTerm" : this.state["tdSectionCheck" + i],
                "isLikeSearchable" : this.state["tdLikeKeyword" + i]
            })
         }

        const meta = {
            "dataName" : this.state.dataName,
            "tblName"  : this.state.tblName,
            "dataProvider" :decodeURI(loginName),
            "dataModifier" : decodeURI(loginName),
            "providerLoginId": loginId,
            "isPublic" : this.state.isPublic,
            "description" : this.state.description,
            "hpaiTblMetaHistories" : hpaiTblMetaHistories,
            "hpaiTblMetaColumns" : hpaiTblMetaColumns
        }
        //신규 테이블에 추가하는 경우에 post
        if(seq==null){
            axios.post(sdlDataDetailUrl , meta)
                .then((response) => {

                window.location.href= './HistoryDetails?hpaiTblMetaSeq=' + response.data.seq + '&hpaiTblHistorySeq='+response.data.historySeq;

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

        //기존 테이블에 추가하는 경우에. put 
        }else if(seq !=null){
            axios.put(sdlDataDetailUrl ,meta)
            .then((response) => {

             window.location.href= './HistoryDetails?hpaiTblMetaSeq='+ response.data.seq + '&hpaiTblHistorySeq='+response.data.historySeq;
             
            }).catch(function (error) {
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

        }
        //confirm 확인창 
        }else{
            return false;
        }
    }

    //step1 유효성 검사. 
    descriptionValidation = (e) => {
        if(e.target.value.length>255){
            /* // 글자수를 초과하였다 하더라도 해당 입력란의 내용을 초기화 하면 안됨
            e.target.value = "";
            this.setState({
                description : e.target.value
            })
            */

            if(window.confirm("글자수를 초과하였습니다(최대길이:255) 최대 길이 이후 내용을 삭제하시겠습니까?")) {
                e.target.value = e.target.value.substring(0, 255);
                this.setState({
                    description : e.target.value
                })                
            }
            return false;
        }
    }
      dataNameBlur = (e) => {
        let curValue = e.target.value;
        let newValue = e.target.value;
        let dataNameReqExp = /[/?.,;:|\)*~`!^\-+┼<>@\#$%&\'\"\\\(\=]/gi
        let tblNameReqExp = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣\s/?.,;:|\)*~`!^\-+┼<>@\#$%&\'\"\\\(\=]/gi

        if(e.target.name == 'dataName'){
            if(dataNameReqExp.test(curValue)){
                alert("데이터명의 특수문자는 입력 불가능 합니다.(언더바 제외)")
                newValue = curValue.replace(dataNameReqExp,'');
            }

        }else if(e.target.name == 'tblName'){
            if(tblNameReqExp.test(curValue)){
                alert("테이블명의 한글 입력,특수문자는 불가능 합니다.(언더바 제외)")
                newValue = curValue.replace(tblNameReqExp,'');
            }
        }
        
        this.setState({
            [e.target.name] : newValue.toLowerCase()
        })

    }

    render = () => {
        const {color} = this.props;
        let isPublic = '';
        let dataNameInput = '';
        let tableNameInput = '';
        let dataDeleteSaveMessage = '';
        let stopWorkMessage = '';
        let datadeletMessage = '';
        //step4 자식에서 가지고온 데이터 넣기.
        let tdColumNameEnglishValue = [];
        let tdColumTypeValue = [];
        let tdColumLengthValue = [];
        let tdformValue = [];
        let tdColumNameKoreaValue = [];
        let tdRequireCheckValue = [];
        let tdKeyCheckValue = [];
        let tdSearchCheckValue = [];
        let tdSectionCheckValue = [];
        let tdLikeKeywordValue = [];
        let columNameEnglish = [];
        let columType = [];
        let columLength = [];
        let form = [];
        let columNameKorea =[];
        let requireCheck = [];
        let keyCheck = [];
        let searchCheck = [];
        let sectionCheck = [];
        let likeKeyword = [];
        let footColumns = [];
        let footTableData = [];

        //step1 신규등록할 경우와 기존테이블을 선택할 경우를 나눈다. 기존테이블을 선택할 경우 데이터명은 수정가능하고 테이블명은 수정이 불가능.
        if (seq == null) {
            dataNameInput = <Input type="text" name="dataName" id="dataName" value={this.state.dataName} placeholder="데이터명" onBlur={this.dataNameBlur.bind(this)} onChange={this.handleChange} maxLength="64"/>
            tableNameInput = <Input type="text" name="tblName" id="tblName" value={this.state.tblName} placeholder="테이블명" onBlur={this.dataNameBlur.bind(this)} onChange={this.handleChange} maxLength="64"/>
        } else {
            dataNameInput = <Input type="text" name="dataName" id="dataName" placeholder="데이터명" value={this.state.dataName} onChange={this.handleChange} maxLength="64"/>
            tableNameInput = <Input type="text" name="tblName" id="tblName" placeholder="테이블명" value={this.state.tblName} readOnly="readOnly"/>
        }

        //공개여부 text로 바꾸기.
        if (this.state.isPublic == true) {
            isPublic = '공개';
        } else {
            isPublic = '비공개';
        }

        //저장옵션 text로 바꾸기. 기존데이터 삭제후 저장.
        if (this.state.dataDeleteSave == true) {
            dataDeleteSaveMessage = 'Y';
        } else {
            dataDeleteSaveMessage = 'N';
        }

        //저장옵션 text로 바꾸기. 작업중지.
        if (this.state.stopWork == true) {
            stopWorkMessage = 'Y';
        } else {
            stopWorkMessage = 'N';
        }

        //저장옵션 text로 바꾸기. 데이터삭제
        if (this.state.datadelete == true) {
            datadeletMessage = 'Y';
        } else {
            datadeletMessage = 'N';
        }

        //작업 중지시 데이터 삭제 disable 
        let datadeleteState ='';
        if(this.state.stopWork == true){
            datadeleteState =
                <td>
                    <CustomInput
                        type="switch"
                        name="datadelete"
                        id = "datadelete"
                        label="데이터 삭제"
                        checked={this.state.datadelete}
                        onClick={this.handleChange}
                    />                                      
                </td>
        }else{
            datadeleteState =
                <td>
                    <CustomInput
                        type="switch"
                        name="datadelete"
                        id = "datadelete"
                        label="데이터 삭제"
                        checked={this.state.datadelete}
                        onClick={this.handleChange}
                        disabled
                    />                                   
                </td>
        }

        //data길이만큼 for문을 돌린다.
        for (let i = 0; i < columnSeq.length; i++) {
            //값 넣기. 
            tdColumNameEnglishValue.push(<td>{this.state['tdColumNameEnglish'+i]}</td>);

            //컬럼 타입 text로 바꾸기. string,number,date,time      
            if(this.state["tdColumType" + i] =='STRING'){
                tdColumTypeValue.push(<td>문자</td>)
            }else if(this.state["tdColumType" + i] =='NUMBER'){
                tdColumTypeValue.push(<td>수치</td>)
            }else if(this.state["tdColumType" + i] =='DATE'){
                tdColumTypeValue.push(<td>날짜</td>)
            }else if(this.state["tdColumType" + i] =='TIME'){
                tdColumTypeValue.push(<td>시간</td>)
            };

            tdColumLengthValue.push(<td>{this.state["tdColumLength" + i]}</td>);
            tdformValue.push(<td>{this.state["tdform" + i]}</td>);
            tdColumNameKoreaValue.push(<td>{this.state["tdColumNameKorea" + i]}</td>);

            //checkbox true false값(Y,N)으로 변경하기.
            if (this.state["tdRequireCheck" + i] == true) {
                tdRequireCheckValue.push(<td>Y</td>);
            } else {
                tdRequireCheckValue.push(<td>N</td>);
            }
            if (this.state["tdKeyCheck" + i] == true) {
                tdKeyCheckValue.push(<td>Y</td>);
            } else {
                tdKeyCheckValue.push(<td>N</td>);
            }
            if (this.state["tdSearchCheck" + i] == true) {
                tdSearchCheckValue.push(<td>Y</td>);
            } else {
                tdSearchCheckValue.push(<td>N</td>);
            }
            if (this.state["tdSectionCheck" + i] == true) {
                tdSectionCheckValue.push(<td>Y</td>);
            } else {
                tdSectionCheckValue.push(<td>N</td>);
            }
            if (this.state["tdLikeKeyword" + i] == true) {
                tdLikeKeywordValue.push(<td>Y</td>);
            } else {
                tdLikeKeywordValue.push(<td>N</td>);
            }

             columNameEnglish.push(this.state["tdColumNameEnglish" + i]);
             columType.push(this.state["tdColumType" + i]);
             columLength.push(this.state["tdColumLength" + i]);
             form.push(this.state["tdform" + i]);
             columNameKorea.push(this.state["tdColumNameKorea" + i]);
             requireCheck.push(this.state["tdRequireCheck" + i]);
             keyCheck.push(this.state["tdKeyCheck" + i]);
             searchCheck.push(this.state["tdSearchCheck" + i]);
             sectionCheck.push(this.state["tdSectionCheck" + i]);
             likeKeyword.push(this.state["tdLikeKeyword" + i]);
             footColumns.push(<td>{this.state["tdFieldName" + i]}</td>);
        }

        //step4 데이터 미리보기 동적으로 만들기 위해... 
        if(this.state.footPreviewData != null){
            for(let j=0; j<this.state.footPreviewData.length; j++){        
                let tempRow = [];
                for(let i=0 ; i < columnName.length ; i++){                                    
                    tempRow.push(
                        <td>
                            <div style={{width:'200px',overflow:'hidden',textOverflow:'ellipsis', float:'left'}}>
                                {this.state.footPreviewData[j][this.state["tdColumNameEnglish" + i]]}
                            </div>
                        </td>
                    )
                }
                footTableData.push(
                    <tr>
                        {tempRow}
                    </tr>
                )
            }  
        }
        return (
            
            <div ref="smartwizard" className={`wizard wizard-${color} mb-4`} style={{width: '100%'}}><br></br><br></br>
                <ul>
                    <li style={{width:'calc(23%)'}}>
                        <a href={`#step-1`}>
                            데이터명 입력
                            <br/>
                            <small>데이터명,테이블명,설명 입력</small>
                        </a>
                    </li>
                    <li style={{width:'calc(23%)'}}>
                        <a href={`#step-2`}>
                            데이터 미리보기
                            <br/>
                            <small>최상단 데이터 20건을 조회</small>
                        </a>
                    </li>
                    <li style={{width:'calc(23%)'}}>
                        <a href={`#step-3`}>
                            저장 옵션 선택
                            <br/>
                            <small>오류 발생시 처리 방법</small>
                        </a>
                    </li>
                    <li style={{width:'calc(23%)'}}>
                        <a href={`#step-4`}>
                            입력 내용 확인
                            <br/>
                            <small>선택한 옵션과 입력 데이터 확인</small>
                        </a>
                    </li>
                </ul>
                <div>
                    <div id={`step-1`}>
                        <Table bordered>
                            <tbody >
                            <div className="mb-2">
                          
                            </div>

                                <tr>
                                    <th className="table-active" style={{verticalAlign:'middle', textAlign:'center',width: "121px" }}>데이터명</th>{/*backgroundColor: '#e9ecef' */}
                                        <td>
                                            {dataNameInput}
                                        </td>
                                    <th className="table-active" style={{verticalAlign:'middle', textAlign:'center',width: "121px"}}>테이블명</th>
                                        <td>
                                            {tableNameInput}
                                        </td>
                                </tr>
                                <tr>
                                    <th className="table-active" style={{verticalAlign:'middle', textAlign:'center'}}><center>설명</center></th>
                                    <td colSpan='3'>
                                        <Input
                                            type="textarea"
                                            name="description"
                                            id = "description"
                                            onChange={this.handleChange}
                                            onBlur = {this.descriptionValidation.bind(this)}
                                            rows="3"
                                            value={this.state.description}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <th className="table-active" style={{verticalAlign:'middle', textAlign:'center'}}>공개여부</th>
                                    <td colSpan='3'>
                                        <CustomInput
                                            type="switch"
                                            name="isPublic"
                                            id = "isPublic"
                                            onClick={this.handleChange}
                                            checked={this.state.isPublic}
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </Table>
                    </div>

                    <div id={`step-2`}>
                    <Table bordered>
                            <tbody>
                                <tr>
                                    <th className="table-active" style={{verticalAlign:'middle', textAlign:'center',width:'121px'}} >데이터명</th>
                                        <td>
                                            <Input
                                                type="text"
                                                value={this.state.dataName}
                                                onChange={this.handleChange}
                                                readOnly="readOnly"/>
                                        </td>
                                    <th className="table-active"  style={{verticalAlign:'middle', textAlign:'center',width:'121px'}} >테이블명</th>
                                        <td>
                                            <Input
                                                type="text"
                                                value={this.state.tblName}
                                                onChange={this.handleChange}
                                                readOnly="readOnly"/>
                                        </td>
                                </tr>
                                <tr>
                                    <th className="table-active" style={{verticalAlign:'middle', textAlign:'center',width:'121px'}}><center>설명</center></th>
                                    <td colSpan='3'>
                                        <Input
                                            type="textarea"
                                            rows="3"
                                            value={this.state.description}
                                            onChange={this.handleChange}
                                            readOnly="readOnly"/>
                                    </td>
                                </tr>
                                <tr>
                                    <th className="table-active" style={{verticalAlign:'middle', textAlign:'center',width:'121px'}} >공개여부</th>
                                    <td colSpan='3'>
                                        <Input type="text" value={isPublic} readOnly="readOnly"/>
                                    </td>
                                </tr>
                                <tr>
                                    <th className="table-active" style={{verticalAlign:'middle', textAlign:'center',width:'121px'}} >파일찾기</th>
                                    <td colSpan='3'>
                                        <Input type="file" name="fileName" id="fileName" onBlur={this.filehandleChange}/>
                                    </td>
                                </tr>
                            </tbody>
                        </Table>
                        <FormGroup row>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <Button type="button" id="previewButton" color="primary" onClick={this.previewButtonOnClik.bind(this)}>미리보기</Button>
                            <input type="hidden" id="previewButtonCount"></input>
                            {/*자식컴포넌트에서 부모 컴포넌트로 데이터 보내는 방법.
                            *1.onChange 라는 이름으로 props를 child로 보냄.
                            2. child에서 porps.onChange를 호출 할 시 위 changeState 콜백함수가 실행됨.
                            */
                            }
                            {this.state.showPreview? <PreviewData parentState = {this.state} parentChange={this.changeState.bind(this)} />: null}
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
                        </FormGroup>
                    </div>

                    <div id={`step-3`}>
                    <Table bordered>
                        <tbody>
                            <tr>
                                <th className="table-active" style={{verticalAlign:'middle', textAlign:'center', width:'150px'}}>기존 데이터 처리</th>
                                <td colSpan='2'>
                                    <CustomInput
                                        type="switch"
                                        name="dataDeleteSave"
                                        id = "dataDeleteSave"
                                        label="기존 데이터 삭제 후 저장"
                                        checked={this.state.dataDeleteSave}
                                        onClick={this.handleChange}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <th className="table-active" style={{verticalAlign:'middle', textAlign:'center', width:'150px'}}>오류 발생 시 처리</th>
                                <td>
                                    <CustomInput
                                        type="switch"
                                        name="stopWork"
                                        id = "stopWork"
                                        label="작업 중지"
                                        checked={this.state.stopWork}
                                        onClick={this.handleChange}
                                    />                                            
                                </td>
                                {/*데이터 삭제 disable */}
                                {datadeleteState}
                            </tr>
                        </tbody>
                    </Table>
                    </div>
                    <div id={`step-4`}>
                       <Form onSubmit={this.handleSubmit}>
                           <Table bordered responsive>
                               <tbody>
                                   <tr>
                                       <th className="table-active" style={{verticalAlign:'middle', textAlign:'center',width:'128px'}} >데이터 명</th>
                                       <td>
                                            <Input type="text" value={this.state.dataName} readOnly/>
                                       </td>

                                       <th className="table-active" style={{verticalAlign:'middle', textAlign:'center',width:'128px'}}>테이블 명</th>
                                       <td>
                                            <Input type="text" value={this.state.tblName} readOnly/>
                                       </td>
                                   </tr>
                                   <tr>
                                       <th className="table-active" style={{verticalAlign:'middle', textAlign:'center',width:'128px'}}>설명</th>
                                       <td colSpan='3'>
                                            <Input type="textarea" rows="3" value={this.state.description} readOnly/>
                                       </td>
                                   </tr>
                                   <tr>
                                       <th className="table-active" style={{verticalAlign:'middle', textAlign:'center',width:'128px'}}>공개여부</th>
                                       <td colSpan='3'>
                                            <Input type="text" value={isPublic} readOnly/>
                                       </td>
                                   </tr>
                                   <tr>
                                       <th className="table-active" style={{verticalAlign:'middle', textAlign:'center',width:'128px'}}>저장옵션</th>
                                       <td colSpan='3'>
                                            작업전 기존 데이터 삭제 : <b>{dataDeleteSaveMessage}</b>&nbsp;&nbsp;&nbsp; 오류 시 작업 중지 : <b>{stopWorkMessage}</b>&nbsp;&nbsp;&nbsp;오류 시 데이터 삭제 : <b>{datadeletMessage}</b>
                                       </td>
                                   </tr>
                                   <tr>
                                       <th className="table-active" style={{verticalAlign:'middle', textAlign:'center',width:'128px'}}>파일명</th>
                                       <td colSpan='3'>
                                           <Input type="text"  value={this.state.serverfileName} readOnly/>
                                        </td>
                                   </tr>
                               </tbody>
                            </Table>    
                            <Table bordered style={{whiteSpace: "nowrap"}} responsive>
                                    <br/>
                                    <CardTitle tag="h5">항목</CardTitle>
                                        <h6 className="card-subtitle text-muted">
                                            데이터 미리보기
                                        </h6><br/>
                                <tbody>
                                    <tr>
                                        <th className="table-active" style={{verticalAlign:'middle', textAlign:'center'}}>컬럼명(영문)</th>
                                        {tdColumNameEnglishValue}
                                    </tr>
                                    <tr>
                                        <th className="table-active" style={{verticalAlign:'middle', textAlign:'center'}}>컬럼 유형</th>
                                        {tdColumTypeValue}
                                    </tr>
                                    <tr>
                                        <th className="table-active" style={{verticalAlign:'middle', textAlign:'center'}}>컬럼 길이</th>
                                        {tdColumLengthValue}
                                    </tr>
                                    <tr>
                                        <th className="table-active" style={{verticalAlign:'middle', textAlign:'center'}}>형식</th>
                                        {tdformValue}
                                    </tr>
                                    <tr>
                                        <th className="table-active" style={{verticalAlign:'middle', textAlign:'center'}}>코멘트</th>
                                        {tdColumNameKoreaValue}
                                    </tr>
                                    <tr>
                                        <th className="table-active" style={{verticalAlign:'middle', textAlign:'center'}}>키여부</th>
                                        {tdKeyCheckValue}
                                    </tr>
                                    <tr>
                                        <th className="table-active" style={{verticalAlign:'middle', textAlign:'center'}}>필수 여부</th>
                                        {tdRequireCheckValue}
                                    </tr>
                                    <tr>
                                        <th className="table-active" style={{verticalAlign:'middle', textAlign:'center'}}>검색기능</th>
                                        {tdSearchCheckValue}
                                    </tr>
                                    <tr>
                                        <th className="table-active" style={{verticalAlign:'middle', textAlign:'center'}}>구간검색</th>
                                        {tdSectionCheckValue}
                                    </tr>
                                    <tr>
                                        <th className="table-active" style={{verticalAlign:'middle', textAlign:'center'}}>Like 키워드 검색</th>
                                        {tdLikeKeywordValue}
                                    </tr>
                                    <tr>
                                    <th rowSpan={footTableData.length+1} className="table-active" style={{verticalAlign:'middle', textAlign:'center'}}><center>데이터</center></th>
                                        {footColumns}
                                    </tr>
                                        {footTableData}
                                </tbody>
                            </Table>
                            <br/>
                            <button style={{float: 'right'}} className="btn btn-primary" type="submit">등록</button><br></br>
                        </Form> 
                    </div>
                </div>
            </div>
        );
    };
}

export default WizardVariant;