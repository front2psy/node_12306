const https = require('https');
const http = require('http');
const fs = require('fs');
const ca = fs.readFileSync('./cert/srca.cer.pem');
const nodemailer = require('nodemailer');
const schedule = require('node-schedule');
const scanf = require('scanf');
const program = require('commander');
const UA = "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36";
const inquirer = require('inquirer');
var config = {
	time:'2018-01-21',//日期格式必须是这样
    from_station:'shenzhen',
    end_station:'jiujiang',
    train_num:'Z186|K92|K824',//车次
    your_mail:'sxliu_199124@163.com',
    mail_pass:'sxliu246'
};
let _stations = JSON.parse(fs.readFileSync('station.json', 'utf-8'));
let isRewrite = hasArgv(process.argv, '-r');
function hasArgv(argv, filter) {
	argv = argv.slice(2);
	return argv.some((item, i) => {
		return filter;
	});
}
function searchTrain(answers, input) {
	input = input || '';
	console.log(input);
	return;
	if (Object.prototype.toString.call(_stations.stationInfo[input]) === '[object Array]') {

	}
	else {

	}
}

config.from_station = _stations.stationInfo[config.from_station];	
config.end_station = _stations.stationInfo[config.end_station];	
config.train_num = config.train_num.split('|');
config.ticket_type = 'ADULT';
config.receive_mail = "sxliu_199124@qq.com";

var rule = new schedule.RecurrenceRule();
rule.second = [0];
queryTickets(config);
schedule.scheduleJob(rule, function () {
	queryTickets(config);
});

var yz_temp = [], yw_temp = [];//保存余票状态
/*
* 查询余票
*/
function queryTickets(config) {
	/*设置请求头参数*/
	var options = {
		hostname: 'kyfw.12306.cn',//12306
		port: 443,
		method: 'GET',
		path: '/otn/leftTicket/queryZ?leftTicketDTO.train_date=' + config.time + '&leftTicketDTO.from_station=' + config.from_station.code + '&leftTicketDTO.to_station=' + config.end_station.code + '&purpose_codes=' + config.ticket_type,
		// ca: [ca],//证书
		rejectUnauthorized: false,
		headers: {
			'Connection': 'keep-alive',
			'Host': 'kyfw.12306.cn',
			'User-Agent': UA,
			"Connection": "keep-alive",
			"Referer": "https://kyfw.12306.cn/otn/leftTicket/init",
			"Cookie": "JSESSIONID=384B66224DADEF6F7D23FDDC09985C3C; route=c5c62a339e7744272a54643b3be5bf64; BIGipServerotn=2296905994.50210.0000; RAIL_EXPIRATION=1515572331638; RAIL_DEVICEID=gI2YE9-ja_gRmJmzLMcaMLRLb-9bRzd25jWYrEsHNdQ79z_-E-r8SBKtk94-BVYY1YCbhdss4KLqjZnmJDzmw6xLgRO0mztPM5baZ8AbtCra3N1KnmCqgxKyk7UCFz36zMMxX28ayx2w_Mfd61jhq8Hryw3MIebn; _jc_save_fromStation=%u6DF1%u5733%2CSZQ; _jc_save_toStation=%u4E5D%u6C5F%2CJJG; _jc_save_fromDate=2018-02-05; _jc_save_toDate=2018-01-07; _jc_save_wfdc_flag=dc",
		}
	};
	function b4(ct, cv) {
		var cs = [];
		for (var cr = 0; cr < ct.length; cr++) {
			var cw = [];
			var cq = ct[cr].split("|");
			cw.secretHBStr = cq[36];
			cw.secretStr = cq[0];
			cw.buttonTextInfo = cq[1];
			var cu = [];
			cu.train_no = cq[2];
			cu.station_train_code = cq[3];
			cu.start_station_telecode = cq[4];
			cu.end_station_telecode = cq[5];
			cu.from_station_telecode = cq[6];
			cu.to_station_telecode = cq[7];
			cu.start_time = cq[8];
			cu.arrive_time = cq[9];
			cu.lishi = cq[10];
			cu.canWebBuy = cq[11];
			cu.yp_info = cq[12];
			cu.start_train_date = cq[13];
			cu.train_seat_feature = cq[14];
			cu.location_code = cq[15];
			cu.from_station_no = cq[16];
			cu.to_station_no = cq[17];
			cu.is_support_card = cq[18];
			cu.controlled_train_flag = cq[19];
			cu.gg_num = cq[20] ? cq[20] : "--";
			cu.gr_num = cq[21] ? cq[21] : "--";
			cu.qt_num = cq[22] ? cq[22] : "--";
			cu.rw_num = cq[23] ? cq[23] : "--";
			cu.rz_num = cq[24] ? cq[24] : "--";
			cu.tz_num = cq[25] ? cq[25] : "--";
			cu.wz_num = cq[26] ? cq[26] : "--";
			cu.yb_num = cq[27] ? cq[27] : "--";
			cu.yw_num = cq[28] ? cq[28] : "--";
			cu.yz_num = cq[29] ? cq[29] : "--";
			cu.ze_num = cq[30] ? cq[30] : "--";
			cu.zy_num = cq[31] ? cq[31] : "--";
			cu.swz_num = cq[32] ? cq[32] : "--";
			cu.srrb_num = cq[33] ? cq[33] : "--";
			cu.yp_ex = cq[34];
			cu.seat_types = cq[35];
			cu.exchange_train_flag = cq[36];
			cu.from_station_name = cv[cq[6]];
			cu.to_station_name = cv[cq[7]];
			cw.queryLeftNewDTO = cu;
			cs.push(cw)
		}
		return cs
	}
	/*请求开始*/
	var req = https.get(options, function (res) {
		var data = '';
		/*设置邮箱信息*/
		var transporter = nodemailer.createTransport({
			host: "smtp.163.com",//邮箱的服务器地址，如果你要换其他类型邮箱（如QQ）的话，你要去找他们对应的服务器，
			secureConnection: true,
			port: 465,//端口，这些都是163给定的，自己到网上查163邮箱的服务器信息
			auth: {
				user: config.your_mail,//邮箱账号
				pass: config.mail_pass,//邮箱密码
			}
		});
		res.on('data', function (buff) {
			data += buff;//查询结果（JSON格式）
			console.log("buff",data);
		});
		res.on('end', function () {
			var jsonData;
			var trainData;
			//用来保存返回的json数据
			var trainMap;

			console.log("res",data);
			try {
				var _data = data && JSON.parse(data).data;
				trainData = _data && _data.result;
				trainMap = _data && _data.map;
			} catch (e) {
				console.log('JSON数据出错,请检查输入配置是否正确', e);
				return;
			}
			jsonData = b4(trainData, trainMap);
			if (!jsonData || jsonData.length == 0) {
				console.log('没有查询到余票信息');
				return;
			}
			/*获取车次与车辆代码的映射表*/
			var jsonMap = {};
			for (var i = 0; i < jsonData.length; i++) {
				var cur = jsonData[i];
				jsonMap[cur.queryLeftNewDTO.station_train_code] = cur.queryLeftNewDTO;

			}
			/*过滤不需要的车次*/
			var train_arr = config.train_num;
			for (var j = 0; j < train_arr.length; j++) {
				var cur_train = jsonMap[train_arr[j]];//当前车次
				if (!cur_train) {
					console.log('当天没有' + train_arr[j] + '这趟车次');
					continue;
				}
				var yz = cur_train.yz_num;//硬座数目
				var yw = cur_train.yw_num;//硬卧数目
				var trainNum = cur_train.station_train_code;//车次
				console.log('\n ' + trainNum + ' 车次的硬座余票数:', yz, ', 硬卧余票数:', yw, '。当前时间：' + getTime());
				if (yz != '无' && yz != '--' || yw != '无' && yw != '--') {
					if (yw_temp[j] == yw && yz_temp[j] == yz) {//当余票状态发生改变的时候就不发送邮件
						console.log(' ' + trainNum + '车次状态没改变，不重复发邮件');
						continue;
					}
					var mailOptions = {
						from: config.your_mail, // 发件邮箱地址
						to: config.receive_mail || config.your_mail, // 收件邮箱地址，可以和发件邮箱一样
						subject: trainNum + '有票啦，硬座：' + yz + '，硬卧：' + yw, // 邮件标题
						text: trainNum + '有票啦\n' + cur_train.from_station_name + '=============>' + cur_train.to_station_name + '\n出发日期：' + config.time + ',\n出发时间：' + cur_train.start_time + ',\n到达时间：' + cur_train.arrive_time + ',\n历时：' + cur_train.lishi, // 邮件内容
					};

					// 发邮件部分
					(function (j, yz, yw) {
						transporter.sendMail(mailOptions, function (error, info) {
							if (error) {
								return console.log(error);
							}
							console.log(' 邮件已发送: ====================> ' + mailOptions.to);
							yw_temp[j] = yw;//保存当前列车的余票数量
							yz_temp[j] = yz;
						});
					})(j, yz, yw);
				} else {
					console.log(trainNum + '硬座/硬卧无票');
				}
			}
			// fs.writeFile('./train.json',data);
		});
	});

	req.on('error', function (err) {
		console.error(err.code);
	});
}

/*
* 爬取全国车站信息并生成JSON文件
*/
function stationJson() {
	let _opt = {
		hostname: 'kyfw.12306.cn',
		path: '/otn/resources/js/framework/station_name.js?station_version=1.9042',
		ca: [ca],
		rejectUnauthorized: false		
	};
	let _data = '';
	let _req = https.get(_opt, function (res) {
		res.on('data', function (buff) {
			_data += buff;
		});
		res.on('end', function () {
			// console.log(_data);
			try {
				let re = /\|[\u4e00-\u9fa5]+\|[A-Z]{3}\|\w+\|\w+\|\w+@\w+/g;
				// console.log('data',_data.match(re));
				let stationMap = {};
				let stationArray = [];
				let temp = _data.match(re);
				[].forEach.call(temp, function (item, i) {
					// console.log(item,i);
					let t = item.split("|");
					let info = {
						name: t[1],
						code: t[2],
						pinyin: t[3],
						suoxie: t[4],
						other: t[5]
					};
					stationArray.push(t[3]);
					if (!stationMap[t[3]]) {
						stationMap[t[3]] = info;						
					}
					else {
						if (Object.prototype.toString.call(stationMap[t[3]]) === '[object Array]') {
							stationMap[t[3]] = [...stationMap[t[3]], info];
						}
						else {
							stationMap[t[3]] = [stationMap[t[3]], info];						
						}
					}
				});
				// console.log(stationMap["hefei"]);
				fs.writeFile('station.json', JSON.stringify({ stationName: stationArray, stationInfo: stationMap }));
			} catch (e) {
				console.log(e);
				return null;
			}
		});
	});
	_req.on('error', function (err) {
		console.error(err.code);
	});
}
function getTime() {
	let T = new Date();
	return T.getFullYear() + '-' + (parseInt(T.getMonth()) + 1) + '-' + T.getDate() + ' ' + T.getHours() + ":" + T.getMinutes() + ":" + T.getSeconds();
}


