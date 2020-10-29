/*
* HPAI 해외 발생 현황 - 년도별 발생 건 수(조류 센서스)
*/

import React from "react";
import { HorizontalBar } from "react-chartjs-2";
import { connect } from "react-redux";
import { MoreHorizontal } from "react-feather";
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
  Button
} from "reactstrap";
import moment from 'moment';
let labels = [];
let values = []; 
class BarChartWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      AnalysisResultData: props.pState, 
      //title:  "BRT 결과분석",
      data: {data:null},
      options: null,
      dataName:props.dataName

    }
  }
  componentDidMount() {
    if(this.props.pState.resultJson != undefined){
      labels = [];
      values = [];  
      let jsonData =this.props.pState.resultJson;
      const removeBackSlash = jsonData.replace(/\\/g,"");
      let resultJson = JSON.parse(removeBackSlash);
      let json_data = resultJson.data.result;
      let key = Object.keys(json_data);
      let value = Object.values(json_data);
      for(let i =0; i<key.length; i++){
        labels.push(key[i])
        values.push(value[i])
      }
    }
    let data = {
      labels: labels,
      datasets: [
        {
          label:"detct cnt",
          backgroundColor: '#47BAC1',
          borderColor: '#47BAC1',
          hoverBackgroundColor: '#47BAC1',
          hoverBorderColor: '#47BAC1',
          data: values
        }
      ]
    };
    let options = null;
    this.setState({
      data: data,
      options: options
    });
  }
  imgDownload(e){
    /*Get image of canvas element*/
    //var url_base64jp = document.getElementById("lineChart").toDataURL("image/jpg");
    let url_base64jp = document.getElementById("lineChart").toDataURL("image/jpg");
    /*get download button (tag: <a></a>) */
    let a =  document.getElementById("download");
    /*insert chart image url to download button (tag: <a></a>) */
    a.href = url_base64jp; 
  }
  render() {
    return (
      <div>
      <HorizontalBarChart  data={this.state.data} options={this.state.options} dropdownItems={this.state.dropdownItems}/>
        <Button className="float-right">
          <a type="hidden" id="download" onClick={this.imgDownload.bind(this)} style={{textDecoration:"none",color:"#fff" }} download={this.props.dataName+"("+ moment(this.props.pState.endDttm).format('YYYY-MM-DD hh:mm:ss')+")"+".jpg"} title="Descargar Gráfico">그래프 이미지 저장</a>
          </Button>
      </div>
    )
  }
}
const HorizontalBarChart = ({ title, data, options_p, dropdownItems }) => {
  let options = {
    maintainAspectRatio: false,
    responsive: true,
    legend: {
      display: false
    },
    maintainAspectRatio : false,
    tooltips: {
      callbacks: {
        label: function (tooltipItem, data) {
          var tooltipValue = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
          if(parseInt(tooltipValue) >= 1000){
            return  tooltipValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          } else {
            return  tooltipValue;
          }
        }
      }
    },
    scales: {
      yAxes: [
        {
          gridLines: { display: false },
          stacked: false,
          ticks: { 
            fontStyle: "bold",
            fontSize: 15,
            stepSize: 20,
            ticks: { beginAtZero:true }
          }
        }
      ],
      xAxes: [
        {
          barPercentage: 0.75,
          categoryPercentage: 0.5,
          stacked: false,
          gridLines: {
            color: "transparent"
          },
          ticks: {
            fontStyle: "bold",
            fontSize: 15,
            beginAtZero: true,
           /*  callback(value) { //왼쪽 축  , 나오게 하기.  
            return (value).toLocaleString('en')
            } */
          }
        }
      ]
    }
  };
  if (options_p != null) {
    options = options_p;
  }
  return (
    <Card className="flex-fill w-100" >
      <CardHeader>
        {
          dropdownItems != null && dropdownItems.length > 0 ?
            <div className="card-actions float-right">
              <UncontrolledDropdown>
                <DropdownToggle tag="a">
                  <MoreHorizontal />
                </DropdownToggle>
                <DropdownMenu right>
                  {dropdownItems}
                </DropdownMenu>
              </UncontrolledDropdown>
            </div>
            :
            null
        }
        <CardTitle tag="h5">
          {title}
        </CardTitle>
      </CardHeader>
      <CardBody className="d-flex">
        <div className="align-self-center w-100">
          <div className="chart">
            <HorizontalBar id="lineChart" data={data} options={options} />
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
export default connect(store => ({
  theme: store.theme.currentTheme
}))(BarChartWrapper);
