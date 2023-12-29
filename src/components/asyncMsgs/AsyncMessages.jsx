import { DownOutlined } from '@ant-design/icons';
import {
	Button,
	Card,
	Col,
	DatePicker,
	Dropdown,
	Input,
	Menu,
	Row,
} from 'antd';
import React, { useState } from 'react';
import {
	CHANGE_LINE_RFS,
	CHANGE_LINE_SA,
	DISCONNECT_LINE_OC,
	DISCONNECT_LINE_SA,
	GET_WSO_ID,
	NEW_RFS,
	ORDER,
	SERVICE_ORDER,
} from '../../constants/apiEndpoints';
import ApiService from '../../services/apiService';
import './AsyncMessages.css'; // Import your custom CSS file for component styling

const AsyncMessages = ({ selectedEnvironment }) => {
	const apiService = new ApiService(selectedEnvironment);
	const [orderId, setOrderId] = useState('');
	const [RFSSAvalues, setRFSSAvalues] = useState({});
	const [rfsDataFromKPN, setRfsDataFromKPN] = useState('');
	const [selectedOrderType, setSelectedOrderType] =
		useState('Select Order Type');
	const [addressAsyncData, setAddressAsyncData] = useState({
		Postcode: '',
		HouseNumber: '',
		HouseNumberExt: '',
	});

	const handleAddressAsyncData = (name, value) => {
		setAddressAsyncData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const [wbaMessages, setWbaMessages] = useState({
		errorCode: '',
		orderNote: '',
		commentCode: '',
		serviceGroup: '',
	});
	const handleWbaMessagesChange = (e) => {
		const { name, value } = e.target;
		setWbaMessages((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const onWBAAsyncSubmit = async (connectionType) => {
		console.log('connectionType', connectionType);
		const useeocApi = true;

		try {
			let endpoint = SERVICE_ORDER.V1 + '/' + orderId;
			let headers = {
				'Content-Type': 'application/json',
				Authorization: 'Basic c3ZjX2NvbXVzZXI6ZXFDU0NxPmU4Iw==',
			};
			let params = '';
			const response = await apiService.get(
				endpoint,
				headers,
				params,
				useeocApi
			);
			console.log(response);
			let CFSName = '';
			if (response && response.orderItem && response.orderItem.length) {
				response.orderItem.forEach((item) => {
					if (
						item.service &&
						(item.service.serviceSpecification.name ===
							'CFS_IP_ACCESS_WBA_FTTH' ||
							item.service.serviceSpecification.name ===
								'CFS_IP_ACCESS_WBA_VDSL')
					) {
						CFSName = item.service.serviceSpecification.name;
						if (item.service.place && item.service.place.length) {
							item.service.place.forEach((place) => {
								if (place.postcode && place.postcode.length) {
									handleAddressAsyncData(
										'Postcode',
										place.postcode
									);
								}
								if (
									place.houseNumber &&
									place.houseNumber.length
								) {
									handleAddressAsyncData(
										'HouseNumber',
										place.postcode
									);
								}
								if (
									place.houseNumberExtension &&
									place.houseNumberExtension.length
								) {
									handleAddressAsyncData(
										'HouseNumberExt',
										place.postcode
									);
								}
								console.log(
									'addressAsyncData',
									addressAsyncData
								);
							});
						}
					}
				});
			}
			getRFSAndSAData(selectedOrderType, CFSName, connectionType);
		} catch (error) {
			console.log(JSON.stringify(error.response?.data || error.message));
		}
	};

	const getRFSAndSAData = async (orderType, CFSName, connectionType) => {
		const useeocApi = true;

		try {
			let endpoint = ORDER.PATH + '/' + orderId + '/?expand=orderItems';
			let headers = {
				'Content-Type': 'application/json',
			};
			let params = '';
			const response = await apiService.get(
				endpoint,
				headers,
				params,
				useeocApi
			);
			console.log('response from ActivationTriger', response);
			console.log('success.response.orderItems -', response.orderItems);
			for (let resorceData of response.orderItems) {
				let cfsData = [
					'CFS_IP_ACCESS_WBA_VDSL',
					'CFS_IP_ACCESS_WBA_FTTH',
					'CFS_IP_ACCESS_GOP_FTTH',
					'CFS_VOICE_GROUP',
				];
				if (cfsData.includes(resorceData.item.description)) {
					for (let resorceCharacteristics of resorceData.item
						.resources) {
						if (
							resorceCharacteristics.resourceSpecification ===
							'RES_LA_WBA_SERVICE'
						) {
							for (let innerData of resorceCharacteristics.resourceCharacteristics) {
								if (
									innerData.name === 'customerConnectionTag'
								) {
									RFSSAvalues.RES_LA_WBA_SERVICE =
										innerData.value;
									console.log(
										'inner value is RES_LA_WBA_SERVICE customerConnectionTag',
										innerData.value
									);
								}
							}
						}
						if (
							resorceCharacteristics.resourceSpecification ===
							'RES_LA_WBA_MANAGEMENT'
						) {
							for (let innerData of resorceCharacteristics.resourceCharacteristics) {
								if (
									innerData.name === 'customerConnectionTag'
								) {
									RFSSAvalues.RES_LA_WBA_MANAGEMENT =
										innerData.value;
									console.log(
										'inner value is RES_LA_WBA_MANAGEMENT customerConnectionTag',
										innerData.value
									);
								}
							}
						}
					}
				}
			}
			getWSOID(orderType, CFSName, connectionType);
		} catch (error) {
			console.log(JSON.stringify(error.response?.data || error.message));
		}
	};

	const getWSOID = async (orderType, CFSName, connectionType) => {
		const useeocApi = true;
		let WSOType = '';
		// if (orderType === 7 || orderType === 8) WSOType = '/wsoType/C';
		// if (orderType === 9 || orderType === 10) WSOType = '/wsoType/M';
		try {
			let endpoint = GET_WSO_ID.PATH + '/' + orderId + WSOType;
			let headers = {
				'Content-Type': 'application/json',
			};
			let params = '';
			const response = await apiService.get(
				endpoint,
				headers,
				params,
				useeocApi
			);
			console.log('success.data.orderItems -', response.wsoId);
			let saConnection = connectionType === 'SA';
			let rfsConnection = connectionType === 'RFS';
			switch (true) {
				case saConnection && orderType === 'New line':
					sendSaFromKPN(response.wsoId, CFSName);
					break;
				case rfsConnection && orderType === 'New line':
					sendRFSFromKPN(response.wsoId, CFSName);
					break;
				case saConnection && orderType === 'Change':
					sendChangeSaFromKPN(response.wsoId, CFSName);
					break;
				case rfsConnection && orderType === 'Change':
					sendChangeRFSFromKPN(response.wsoId, CFSName);
					break;
				case saConnection && orderType === 'Disconnect':
					sendDisconnectSaFromKPN(response.wsoId, CFSName);
					break;
				case rfsConnection && orderType === 'Disconnect':
					sendDisconnectOCFromKPN(response.wsoId, CFSName);
					break;
				case saConnection && orderType === 'Cancel':
					// sendCancelSaFromKPN(response.wsoId, CFSName);
					break;
				case rfsConnection && orderType === 'Cancel':
					// sendCanceLConFFromKPN(response.wsoId, CFSName);
					break;
				case orderType === 9:
					// getSecondWSOID(response.wsoId, 1, CFSName);
					break;
				case orderType === 10:
					// getSecondWSOID(response.wsoId, 2, CFSName);
					break;
				case saConnection && orderType === 11:
					// sendMigrateOutData(data.wsoId, true, 'MigrateSASyncSent');
					break;
				case orderType === 12:
					// sendMigrateOutData(data.wsoId, false, 'MigrateOcSyncSent');
					break;
				case orderType === 13:
					// sendNewDelayData(data.wsoId, CFSName);
					break;
				default:
					break;
			}
			console.log(response);
		} catch (error) {
			console.log(JSON.stringify(error.response?.data || error.message));
		}
	};

	const sendSaFromKPN = async (wsoId, CFSName) => {
		const useeocApi = true;
		var newdate = new Date();
		var dd = '' + newdate.getDate();
		if (newdate.getDate() < 10) dd = '0' + newdate.getDate();
		let TodaysMonths = newdate.getMonth() + 1;
		var mm = '' + TodaysMonths;
		if (TodaysMonths < 10) mm = '0' + TodaysMonths;
		var yyyy = newdate.getFullYear();
		let errorcode = '<errorcode>0</errorcode>';
		let commentcode = '<comment/>';
		let nodecode = '<order-note/>';
		let accessInstanceID = 'AI-20006535/1';
		let serviceInstanceID = 'SG-20005731';

		if (CFSName == 'CFS_IP_ACCESS_WBA_VDSL') {
			accessInstanceID = 'AI-20006957/1';
			serviceInstanceID = 'SG-20006076';
		}
		let saDataFromKPN = '';
		if (CFSName == 'CFS_IP_ACCESS_WBA_VDSL')
			saDataFromKPN =
				'<bsachangelinesa> <messageheader> <originator>BUBN</originator> <recipient>VTEL</recipient> <messagetype>CHANGE_LINE_SA</messagetype> <messageversion>52</messageversion> <timestamp>20200113171141</timestamp> </messageheader> <messagebody> <generalinfo> <order-id>P2001131710372981</order-id> <order-id-wso>' +
				wsoId +
				'</order-id-wso> <custwishdate>20200113</custwishdate> <orderreceivedatetime>20200113171020</orderreceivedatetime> </generalinfo> <actualuserinfo> <service-group>' +
				serviceInstanceID +
				'</service-group> </actualuserinfo> <orderinfo> <order-type>Change Access</order-type> <line-test-and-label>false</line-test-and-label> <outlet-required>false</outlet-required> </orderinfo> <planninginfo> <planned-tcd>' +
				yyyy +
				'' +
				mm +
				'' +
				dd +
				'</planned-tcd> <planned-ocd>' +
				yyyy +
				'' +
				mm +
				'' +
				dd +
				'</planned-ocd> </planninginfo> <accesselements> <access-instance-id>' +
				accessInstanceID +
				'/1</access-instance-id> <new-access-instance-id>AI-20003575/1</new-access-instance-id> <xdf-access-serviceid>PL1REF7836660574</xdf-access-serviceid> <portfolio-id>W-ADSL-WD</portfolio-id> <carrier-type>Fiber</carrier-type> <technology-type>GoF</technology-type> <access-class>E2E</access-class> <quality-class>INP 0</quality-class> </accesselements> <servicelevelelements> <sla-name>Office hours</sla-name> </servicelevelelements> <serviceinfo> <serviceelement> <service-instance-id>SI-20007320</service-instance-id> <service-type-id>7420</service-type-id> <service-class>E2E</service-class> <e2einfo> <transport-instance-id>TI-VTEL/4</transport-instance-id> <eap-vlan-id>32</eap-vlan-id> <wap-area>WA-VTEL/97</wap-area> <wap-vlan-id>2521</wap-vlan-id> <customer-connection-tag>' +
				RFSSAvalues.RES_LA_WBA_SERVICE +
				'</customer-connection-tag> </e2einfo> </serviceelement> </serviceinfo> <errorinfo> ' +
				errorcode +
				commentcode +
				nodecode +
				' </errorinfo> </messagebody> </bsachangelinesa>';

		if (CFSName == 'CFS_IP_ACCESS_WBA_FTTH')
			saDataFromKPN =
				'<bsachangelinesa> <messageheader> <originator>BUBN</originator> <recipient>VTEL</recipient> <messagetype>CHANGE_LINE_SA</messagetype> <messageversion>52</messageversion> <timestamp>20200113171141</timestamp> </messageheader> <messagebody> <generalinfo> <order-id>P2001131710372981</order-id> <order-id-wso>' +
				wsoId +
				'</order-id-wso> <custwishdate>20200113</custwishdate> <orderreceivedatetime>20200113171020</orderreceivedatetime> </generalinfo> <actualuserinfo> <service-group>' +
				serviceInstanceID +
				'</service-group> </actualuserinfo> <orderinfo> <order-type>Change Access</order-type> <line-test-and-label>false</line-test-and-label> <outlet-required>false</outlet-required> </orderinfo> <planninginfo> <planned-tcd>' +
				yyyy +
				'' +
				mm +
				'' +
				dd +
				'</planned-tcd> <planned-ocd>' +
				yyyy +
				'' +
				mm +
				'' +
				dd +
				'</planned-ocd> </planninginfo> <accesselements> <access-instance-id>' +
				accessInstanceID +
				'/1</access-instance-id> <new-access-instance-id>AI-20003575/1</new-access-instance-id> <xdf-access-serviceid>PL1REF7836660574</xdf-access-serviceid> <portfolio-id>W-ADSL-WD</portfolio-id> <carrier-type>Fiber</carrier-type> <technology-type>GoF</technology-type> <access-class>E2E</access-class> <quality-class>INP 0</quality-class> </accesselements> <servicelevelelements> <sla-name>Office hours</sla-name> </servicelevelelements> <serviceinfo> <serviceelement> <service-instance-id>SI-20007320</service-instance-id> <service-type-id>7420</service-type-id> <service-class>E2E</service-class> <e2einfo> <transport-instance-id>TI-VTEL/4</transport-instance-id> <eap-vlan-id>32</eap-vlan-id> <wap-area>WA-VTEL/97</wap-area> <wap-vlan-id>2521</wap-vlan-id> <customer-connection-tag>' +
				RFSSAvalues.RES_LA_WBA_SERVICE +
				'</customer-connection-tag> </e2einfo> </serviceelement> </serviceinfo> <errorinfo> ' +
				errorcode +
				commentcode +
				nodecode +
				' </errorinfo> </messagebody> </bsachangelinesa>';

		if (CFSName == 'CFS_IP_ACCESS_GOP_FTTH')
			saDataFromKPN =
				'<bsachangelinesa> <messageheader> <originator>BUBN</originator> <recipient>VTEL</recipient> <messagetype>CHANGE_LINE_SA</messagetype> <messageversion>52</messageversion> <timestamp>20200113171141</timestamp> </messageheader> <messagebody> <generalinfo> <order-id>P2001131710372981</order-id> <order-id-wso>' +
				wsoId +
				'</order-id-wso> <custwishdate>20200113</custwishdate> <orderreceivedatetime>20200113171020</orderreceivedatetime> </generalinfo> <actualuserinfo> <service-group>' +
				serviceInstanceID +
				'</service-group> </actualuserinfo> <orderinfo> <order-type>Change Access</order-type> <line-test-and-label>false</line-test-and-label> <outlet-required>false</outlet-required> </orderinfo> <planninginfo> <planned-tcd>' +
				yyyy +
				'' +
				mm +
				'' +
				dd +
				'</planned-tcd> <planned-ocd>' +
				yyyy +
				'' +
				mm +
				'' +
				dd +
				'</planned-ocd> </planninginfo> <accesselements> <access-instance-id>' +
				accessInstanceID +
				'/1</access-instance-id> <new-access-instance-id>AI-20003575/1</new-access-instance-id> <xdf-access-serviceid>PL1REF7836660574</xdf-access-serviceid> <portfolio-id>W-ADSL-WD</portfolio-id> <carrier-type>Fiber</carrier-type> <technology-type>GoF</technology-type> <access-class>E2E</access-class> <quality-class>INP 0</quality-class> </accesselements> <servicelevelelements> <sla-name>Office hours</sla-name> </servicelevelelements> <serviceinfo> <serviceelement> <service-instance-id>SI-20007320</service-instance-id> <service-type-id>7420</service-type-id> <service-class>E2E</service-class> <e2einfo> <transport-instance-id>TI-VTEL/4</transport-instance-id> <eap-vlan-id>32</eap-vlan-id> <wap-area>WA-VTEL/97</wap-area> <wap-vlan-id>2521</wap-vlan-id> <customer-connection-tag>' +
				RFSSAvalues.RES_LA_WBA_SERVICE +
				'</customer-connection-tag> </e2einfo> </serviceelement> </serviceinfo> <errorinfo> ' +
				errorcode +
				commentcode +
				nodecode +
				' </errorinfo> </messagebody> </bsachangelinesa>';

		try {
			let endpoint = CHANGE_LINE_SA.PATH;
			let headers = {
				'Content-Type': 'text/plain',
			};
			let params = saDataFromKPN;
			const response = await apiService.post(
				endpoint,
				headers,
				params,
				useeocApi
			);
			console.log('Response from SA' + response);
		} catch (error) {
			console.log(JSON.stringify(error.response?.data || error.message));
		}
	};

	const sendRFSFromKPN = async (wsoId, CFSName) => {
		const useeocApi = true;
		var newdate = new Date();
		var dd = '' + newdate.getDate();
		if (newdate.getDate() < 10) dd = '0' + newdate.getDate();
		let TodaysMonths = newdate.getMonth() + 1;
		var mm = '' + TodaysMonths;
		if (TodaysMonths < 10) mm = '0' + TodaysMonths;
		var yyyy = newdate.getFullYear();
		let errorcode = '<errorcode>0</errorcode>';
		let commentcode = '<comment/>';
		let nodecode = '<order-note/>';
		let accessInstanceID = 'AI-20006535/1';
		let serviceInstanceID = 'SG-20005731';

		if (CFSName == 'CFS_IP_ACCESS_WBA_VDSL') {
			accessInstanceID = 'AI-20006957/1';
			serviceInstanceID = 'SG-20006076';
		}

		let houseNumberExt = '';
		if (addressAsyncData.HouseNumberExt)
			houseNumberExt =
				'<housenrext>' +
				addressAsyncData.HouseNumberExt +
				'</housenrext>';
		else houseNumberExt = '</housenrext>';
		let rfsDataFromKPN = '';
		if (CFSName == 'CFS_IP_ACCESS_WBA_VDSL')
			rfsDataFromKPN =
				'<?xml version="1.0" encoding="UTF-8"?> <bsareadyforservice> <messageheader> <originator>BUBN</originator> <recipient>VTEL</recipient> <messagetype>NEW_RFS</messagetype> <messageversion>58</messageversion> <timestamp>20200610133846</timestamp> </messageheader> <messagebody> <generalinfo> <order-id>P2006100857375652</order-id> <order-id-wso>' +
				wsoId +
				'</order-id-wso> <custwishdate>20200610</custwishdate> <orderreceivedatetime>20200610085739</orderreceivedatetime> <reply-tag/> </generalinfo> <actualuserinfo> <street>WIERSSEWG</street> <housenumber>' +
				addressAsyncData.HouseNumber +
				'</housenumber> ' +
				houseNumberExt +
				' <zipcode>' +
				addressAsyncData.Postcode +
				'</zipcode> <city>RUURLO</city> <eapid>SG-20006014</eapid> <service-group>' +
				serviceInstanceID +
				'</service-group> <actual-isra-specs>001/B/MTK/METERKAST</actual-isra-specs> <actual-fiber-terminationpoint-id/> <actual-isra-pin-1>002</actual-isra-pin-1> <actual-isra-pin-2/> </actualuserinfo> <phoneinfo> <requested-phonenumber/> <main-phonenumber/> </phoneinfo> <orderinfo> <order-type>New Access</order-type> <order-scenario>New Line</order-scenario> <order-variant/> <line-test-and-label>true</line-test-and-label> <outlet-required>true</outlet-required> <nl-type>1</nl-type> <nt-service-provider/> <appointment-id/> <appointment-activity-type/> <appointment-activity-feedback>PATCHING BY WBA</appointment-activity-feedback> <delivery-scenario>Patched</delivery-scenario> </orderinfo> <planninginfo> <actual-tcd>' +
				yyyy +
				'' +
				mm +
				'' +
				dd +
				'</actual-tcd> <actual-ocd>' +
				yyyy +
				'' +
				mm +
				'' +
				dd +
				'</actual-ocd> </planninginfo> <distributionpointinfo> <access-area-id>AA/89</access-area-id> </distributionpointinfo> <accesselements> <access-instance-id>' +
				accessInstanceID +
				'</access-instance-id> <xdf-access-serviceid>PL1BNS41165</xdf-access-serviceid> <additional-xdf-access-serviceid>PL1BNS41165</additional-xdf-access-serviceid> <carrier-vendor-id>SDF</carrier-vendor-id> <carrier-type>BCopper_only</carrier-type> <technology-type>BVVDSL2_POTS</technology-type> <nt-type/> <nt-serial-number/> <quality-class>SC</quality-class> </accesselements> <servicelevelelements> <sla-name>24x7</sla-name> </servicelevelelements> <serviceinfo> <serviceelement> <nt-port-number/> <nt-port-type/> <service-instance-id>SI-20013101</service-instance-id> <service-type-id>8405</service-type-id> <service-class>E2E</service-class> <e2einfo> <transport-instance-id>TI-VTEL/4</transport-instance-id> <eap-vlan-id>5</eap-vlan-id> <wap-area>WA-VTEL/82</wap-area> <wap-vlan-id>2489</wap-vlan-id> <customer-connection-tag>' +
				RFSSAvalues.RES_LA_WBA_SERVICE +
				'</customer-connection-tag> </e2einfo> </serviceelement> </serviceinfo> <errorinfo>' +
				errorcode +
				commentcode +
				nodecode +
				' </errorinfo> </messagebody> </bsareadyforservice>';

		if (CFSName == 'CFS_IP_ACCESS_WBA_FTTH')
			rfsDataFromKPN =
				'<?xml version="1.0" encoding="UTF-8"?> <bsareadyforservice> <messageheader> <originator>BUBN</originator> <recipient>VTEL</recipient> <messagetype>NEW_RFS</messagetype> <messageversion>58</messageversion> <timestamp>20200615094837</timestamp> </messageheader> <messagebody> <generalinfo> <order-id>P2006150946375772</order-id> <order-id-wso>' +
				wsoId +
				'</order-id-wso> <custwishdate/> <orderreceivedatetime>20200615094638</orderreceivedatetime> <reply-tag/> </generalinfo> <actualuserinfo> <street>Sonia Delaunaystraat</street> <housenumber>' +
				addressAsyncData.HouseNumber +
				'</housenumber> ' +
				houseNumberExt +
				' <zipcode>' +
				addressAsyncData.Postcode +
				'</zipcode> <city>Rotterdam</city> <eapid>SG-20006118</eapid> <service-group>' +
				serviceInstanceID +
				'</service-group> <actual-isra-specs/> <actual-fiber-terminationpoint-id/> <actual-isra-pin-1/> <actual-isra-pin-2/> </actualuserinfo> <phoneinfo> <requested-phonenumber/> <main-phonenumber/> </phoneinfo> <orderinfo> <order-type>New Access</order-type> <order-scenario>New Line</order-scenario> <order-variant/> <line-test-and-label>false</line-test-and-label> <outlet-required>false</outlet-required> <nl-type>11</nl-type> <nt-service-provider/> <appointment-id/> <appointment-activity-type/> <appointment-activity-feedback>PATCHING BY WBA</appointment-activity-feedback> <delivery-scenario>Patched</delivery-scenario> </orderinfo> <planninginfo> <actual-tcd>' +
				yyyy +
				'' +
				mm +
				'' +
				dd +
				'</actual-tcd> <actual-ocd>' +
				yyyy +
				'' +
				mm +
				'' +
				dd +
				'</actual-ocd> </planninginfo> <distributionpointinfo> <access-area-id>AA/145</access-area-id> </distributionpointinfo> <accesselements> <access-instance-id>' +
				accessInstanceID +
				'</access-instance-id> <xdf-access-serviceid>PL1REF5383407786</xdf-access-serviceid> <additional-xdf-access-serviceid/> <carrier-vendor-id>REGG</carrier-vendor-id> <carrier-type>Fiber</carrier-type> <technology-type>GoF</technology-type> <nt-type/> <nt-serial-number/> <quality-class>INP 0</quality-class> </accesselements> <servicelevelelements> <sla-name>Office hours</sla-name> </servicelevelelements> <serviceinfo> <serviceelement> <nt-port-number/> <nt-port-type/> <service-instance-id>SI-20013251</service-instance-id> <service-type-id>7396</service-type-id> <service-class>E2E</service-class> <e2einfo> <transport-instance-id>TI-VTEL/4</transport-instance-id> <eap-vlan-id>32</eap-vlan-id> <wap-area>WA-VTEL/167</wap-area> <wap-vlan-id>2545</wap-vlan-id> <customer-connection-tag>' +
				RFSSAvalues.RES_LA_WBA_SERVICE +
				'</customer-connection-tag> </e2einfo> </serviceelement> </serviceinfo> <errorinfo> ' +
				errorcode +
				commentcode +
				nodecode +
				' </errorinfo> </messagebody> </bsareadyforservice>';

		if (CFSName == 'CFS_IP_ACCESS_GOP_FTTH')
			rfsDataFromKPN =
				'<?xml version="1.0" encoding="UTF-8"?> <bsareadyforservice> <messageheader> <originator>BUBN</originator> <recipient>VTEL</recipient> <messagetype>NEW_RFS</messagetype> <messageversion>58</messageversion> <timestamp>20200615094837</timestamp> </messageheader> <messagebody> <generalinfo> <order-id>P2006150946375772</order-id> <order-id-wso>' +
				wsoId +
				'</order-id-wso> <custwishdate/> <orderreceivedatetime>20200615094638</orderreceivedatetime> <reply-tag/> </generalinfo> <actualuserinfo> <street>Sonia Delaunaystraat</street> <housenumber>' +
				addressAsyncData.HouseNumber +
				'</housenumber> ' +
				houseNumberExt +
				' <zipcode>' +
				addressAsyncData.Postcode +
				'</zipcode> <city>Rotterdam</city> <eapid>SG-20006118</eapid> <service-group>' +
				serviceInstanceID +
				'</service-group> <actual-isra-specs/> <actual-fiber-terminationpoint-id/> <actual-isra-pin-1/> <actual-isra-pin-2/> </actualuserinfo> <phoneinfo> <requested-phonenumber/> <main-phonenumber/> </phoneinfo> <orderinfo> <order-type>New Access</order-type> <order-scenario>New Line</order-scenario> <order-variant/> <line-test-and-label>false</line-test-and-label> <outlet-required>false</outlet-required> <nl-type>11</nl-type> <nt-service-provider/> <appointment-id/> <appointment-activity-type/> <appointment-activity-feedback>PATCHING BY WBA</appointment-activity-feedback> <delivery-scenario>Patched</delivery-scenario> </orderinfo> <planninginfo> <actual-tcd>' +
				yyyy +
				'' +
				mm +
				'' +
				dd +
				'</actual-tcd> <actual-ocd>' +
				yyyy +
				'' +
				mm +
				'' +
				dd +
				'</actual-ocd> </planninginfo> <distributionpointinfo> <access-area-id>AA/145</access-area-id> </distributionpointinfo> <accesselements> <access-instance-id>' +
				accessInstanceID +
				'</access-instance-id> <xdf-access-serviceid>PL1REF5383407786</xdf-access-serviceid> <additional-xdf-access-serviceid/> <carrier-vendor-id>REGG</carrier-vendor-id> <carrier-type>Fiber</carrier-type> <technology-type>GoF</technology-type> <nt-type/> <nt-serial-number/> <quality-class>INP 0</quality-class> </accesselements> <servicelevelelements> <sla-name>Office hours</sla-name> </servicelevelelements> <serviceinfo> <serviceelement> <nt-port-number/> <nt-port-type/> <service-instance-id>SI-20013251</service-instance-id> <service-type-id>7396</service-type-id> <service-class>E2E</service-class> <e2einfo> <transport-instance-id>TI-VTEL/4</transport-instance-id> <eap-vlan-id>32</eap-vlan-id> <wap-area>WA-VTEL/167</wap-area> <wap-vlan-id>2545</wap-vlan-id> <customer-connection-tag>' +
				RFSSAvalues.RES_LA_WBA_SERVICE +
				'</customer-connection-tag> </e2einfo> </serviceelement> </serviceinfo> <errorinfo> ' +
				errorcode +
				commentcode +
				nodecode +
				' </errorinfo> </messagebody> </bsareadyforservice>';

		try {
			let endpoint = NEW_RFS.PATH;
			let headers = {
				'Content-Type': 'text/plain',
			};
			let params = rfsDataFromKPN;
			const response = await apiService.post(
				endpoint,
				headers,
				params,
				useeocApi
			);
			console.log('Response from RFS' + response);
		} catch (error) {
			console.log(JSON.stringify(error.response?.data || error.message));
		}
	};

	const sendChangeSaFromKPN = async (wsoId, CFSName) => {
		const useeocApi = true;
		var newdate = new Date();
		var dd = '' + newdate.getDate();
		if (newdate.getDate() < 10) dd = '0' + newdate.getDate();
		let TodaysMonths = newdate.getMonth() + 1;
		var mm = '' + TodaysMonths;
		if (TodaysMonths < 10) mm = '0' + TodaysMonths;
		var yyyy = newdate.getFullYear();
		let errorcode = '<errorcode>0</errorcode>';
		let commentcode = '<comment/>';
		let nodecode = '<order-note/>';
		let accessInstanceID = 'AI-20006535/1';
		let serviceInstanceID = 'SG-20005731';

		if (CFSName == 'CFS_IP_ACCESS_WBA_VDSL') {
			accessInstanceID = 'AI-20006957/1';
			serviceInstanceID = 'SG-20006076';
		}
		let saChangeDataFromKPN = '';
		if (CFSName == 'CFS_IP_ACCESS_WBA_VDSL')
			saChangeDataFromKPN =
				'<bsachangelinesa> <messageheader> <originator>BUBN</originator> <recipient>VTEL</recipient> <messagetype>CHANGE_LINE_SA</messagetype> <messageversion>52</messageversion> <timestamp>20200113171141</timestamp> </messageheader> <messagebody> <generalinfo> <order-id>P2001131710372981</order-id> <order-id-wso>' +
				wsoId +
				'</order-id-wso> <custwishdate>20200113</custwishdate> <orderreceivedatetime>20200113171020</orderreceivedatetime> </generalinfo> <actualuserinfo> <service-group>' +
				serviceInstanceID +
				'</service-group> </actualuserinfo> <orderinfo> <order-type>Change Access</order-type> <line-test-and-label>false</line-test-and-label> <outlet-required>false</outlet-required> </orderinfo> <planninginfo> <planned-tcd>' +
				yyyy +
				'' +
				mm +
				'' +
				dd +
				'</planned-tcd> <planned-ocd>' +
				yyyy +
				'' +
				mm +
				'' +
				dd +
				'</planned-ocd> </planninginfo> <accesselements> <access-instance-id>' +
				accessInstanceID +
				'/1</access-instance-id> <new-access-instance-id>AI-20003575/1</new-access-instance-id> <xdf-access-serviceid>PL1REF7836660574</xdf-access-serviceid> <portfolio-id>W-ADSL-WD</portfolio-id> <carrier-type>Fiber</carrier-type> <technology-type>GoF</technology-type> <access-class>E2E</access-class> <quality-class>INP 0</quality-class> </accesselements> <servicelevelelements> <sla-name>Office hours</sla-name> </servicelevelelements> <serviceinfo> <serviceelement> <service-instance-id>SI-20007320</service-instance-id> <service-type-id>7420</service-type-id> <service-class>E2E</service-class> <e2einfo> <transport-instance-id>TI-VTEL/4</transport-instance-id> <eap-vlan-id>32</eap-vlan-id> <wap-area>WA-VTEL/97</wap-area> <wap-vlan-id>2521</wap-vlan-id> <customer-connection-tag>' +
				RFSSAvalues.RES_LA_WBA_SERVICE +
				'</customer-connection-tag> </e2einfo> </serviceelement> </serviceinfo> <errorinfo> ' +
				errorcode +
				commentcode +
				nodecode +
				' </errorinfo> </messagebody> </bsachangelinesa>';
		if (CFSName == 'CFS_IP_ACCESS_WBA_FTTH')
			saChangeDataFromKPN = SaDataFromKPN =
				'<bsachangelinesa> <messageheader> <originator>BUBN</originator> <recipient>VTEL</recipient> <messagetype>CHANGE_LINE_SA</messagetype> <messageversion>52</messageversion> <timestamp>20200113171141</timestamp> </messageheader> <messagebody> <generalinfo> <order-id>P2001131710372981</order-id> <order-id-wso>' +
				wsoId +
				'</order-id-wso> <custwishdate>20200113</custwishdate> <orderreceivedatetime>20200113171020</orderreceivedatetime> </generalinfo> <actualuserinfo> <service-group>' +
				serviceInstanceID +
				'</service-group> </actualuserinfo> <orderinfo> <order-type>Change Access</order-type> <line-test-and-label>false</line-test-and-label> <outlet-required>false</outlet-required> </orderinfo> <planninginfo> <planned-tcd>' +
				yyyy +
				'' +
				mm +
				'' +
				dd +
				'</planned-tcd> <planned-ocd>' +
				yyyy +
				'' +
				mm +
				'' +
				dd +
				'</planned-ocd> </planninginfo> <accesselements> <access-instance-id>' +
				accessInstanceID +
				'/1</access-instance-id> <new-access-instance-id>AI-20003575/1</new-access-instance-id> <xdf-access-serviceid>PL1REF7836660574</xdf-access-serviceid> <portfolio-id>W-ADSL-WD</portfolio-id> <carrier-type>Fiber</carrier-type> <technology-type>GoF</technology-type> <access-class>E2E</access-class> <quality-class>INP 0</quality-class> </accesselements> <servicelevelelements> <sla-name>Office hours</sla-name> </servicelevelelements> <serviceinfo> <serviceelement> <service-instance-id>SI-20007320</service-instance-id> <service-type-id>7420</service-type-id> <service-class>E2E</service-class> <e2einfo> <transport-instance-id>TI-VTEL/4</transport-instance-id> <eap-vlan-id>32</eap-vlan-id> <wap-area>WA-VTEL/97</wap-area> <wap-vlan-id>2521</wap-vlan-id> <customer-connection-tag>' +
				RFSSAvalues.RES_LA_WBA_SERVICE +
				'</customer-connection-tag> </e2einfo> </serviceelement> </serviceinfo> <errorinfo> ' +
				errorcode +
				commentcode +
				nodecode +
				' </errorinfo> </messagebody> </bsachangelinesa>';
		if (CFSName == 'CFS_IP_ACCESS_GOP_FTTH')
			saChangeDataFromKPN =
				'<bsachangelinesa> <messageheader> <originator>BUBN</originator> <recipient>VTEL</recipient> <messagetype>CHANGE_LINE_SA</messagetype> <messageversion>52</messageversion> <timestamp>20200113171141</timestamp> </messageheader> <messagebody> <generalinfo> <order-id>P2001131710372981</order-id> <order-id-wso>' +
				wsoId +
				'</order-id-wso> <custwishdate>20200113</custwishdate> <orderreceivedatetime>20200113171020</orderreceivedatetime> </generalinfo> <actualuserinfo> <service-group>' +
				serviceInstanceID +
				'</service-group> </actualuserinfo> <orderinfo> <order-type>Change Access</order-type> <line-test-and-label>false</line-test-and-label> <outlet-required>false</outlet-required> </orderinfo> <planninginfo> <planned-tcd>' +
				yyyy +
				'' +
				mm +
				'' +
				dd +
				'</planned-tcd> <planned-ocd>' +
				yyyy +
				'' +
				mm +
				'' +
				dd +
				'</planned-ocd> </planninginfo> <accesselements> <access-instance-id>' +
				accessInstanceID +
				'/1</access-instance-id> <new-access-instance-id>AI-20003575/1</new-access-instance-id> <xdf-access-serviceid>PL1REF7836660574</xdf-access-serviceid> <portfolio-id>W-ADSL-WD</portfolio-id> <carrier-type>Fiber</carrier-type> <technology-type>GoF</technology-type> <access-class>E2E</access-class> <quality-class>INP 0</quality-class> </accesselements> <servicelevelelements> <sla-name>Office hours</sla-name> </servicelevelelements> <serviceinfo> <serviceelement> <service-instance-id>SI-20007320</service-instance-id> <service-type-id>7420</service-type-id> <service-class>E2E</service-class> <e2einfo> <transport-instance-id>TI-VTEL/4</transport-instance-id> <eap-vlan-id>32</eap-vlan-id> <wap-area>WA-VTEL/97</wap-area> <wap-vlan-id>2521</wap-vlan-id> <customer-connection-tag>' +
				RFSSAvalues.RES_LA_WBA_SERVICE +
				'</customer-connection-tag> </e2einfo> </serviceelement> </serviceinfo> <errorinfo> ' +
				errorcode +
				commentcode +
				nodecode +
				' </errorinfo> </messagebody> </bsachangelinesa>';
		try {
			let endpoint = CHANGE_LINE_SA.PATH;
			let headers = {
				'Content-Type': 'text/plain',
			};
			let params = saChangeDataFromKPN;
			const response = await apiService.post(
				endpoint,
				headers,
				params,
				useeocApi
			);
			console.log('Response from SA' + response);
		} catch (error) {
			console.log(JSON.stringify(error.response?.data || error.message));
		}
	};

	const sendChangeRFSFromKPN = async (wsoId, CFSName) => {
		const useeocApi = true;
		var newdate = new Date();
		var dd = '' + newdate.getDate();
		if (newdate.getDate() < 10) dd = '0' + newdate.getDate();
		let TodaysMonths = newdate.getMonth() + 1;
		var mm = '' + TodaysMonths;
		if (TodaysMonths < 10) mm = '0' + TodaysMonths;
		var yyyy = newdate.getFullYear();
		let errorcode = '<errorcode>0</errorcode>';
		let commentcode = '<comment/>';
		let nodecode = '<order-note/>';
		let accessInstanceID = 'AI-20006535/1';
		let serviceInstanceID = 'SG-20005731';

		if (CFSName == 'CFS_IP_ACCESS_WBA_VDSL') {
			accessInstanceID = 'AI-20006957/1';
			serviceInstanceID = 'SG-20006076';
		}
		let rfsChangeDataFromKPN = '';
		if (CFSName == 'CFS_IP_ACCESS_WBA_VDSL')
			rfsChangeDataFromKPN =
				'<bsachangelinerfs> <messageheader> <originator>BUBN</originator> <recipient>VTEL</recipient> <messagetype>CHANGE_LINE_RFS</messagetype> <messageversion>52</messageversion> <timestamp>20200113171155</timestamp> </messageheader> <messagebody> <generalinfo> <order-id>P2001131710372981</order-id> <order-id-wso>' +
				wsoId +
				'</order-id-wso> <custwishdate>20200113</custwishdate> <orderreceivedatetime>20200113171020</orderreceivedatetime> </generalinfo> <actualuserinfo> <service-group>' +
				serviceInstanceID +
				'</service-group> </actualuserinfo> <orderinfo> <order-type>Change Access</order-type> <line-test-and-label>false</line-test-and-label> <outlet-required>false</outlet-required> </orderinfo> <planninginfo> <actual-tcd>' +
				yyyy +
				'' +
				mm +
				'' +
				dd +
				'</actual-tcd> <actual-ocd>' +
				yyyy +
				'' +
				mm +
				'' +
				dd +
				'</actual-ocd> </planninginfo> <accesselements> <access-instance-id>' +
				accessInstanceID +
				'</access-instance-id> <new-access-instance-id>AI-20003575/1</new-access-instance-id> <xdf-access-serviceid>PL1REF7836660574</xdf-access-serviceid> <portfolio-id>W-ADSL-WD</portfolio-id> <carrier-type>Fiber</carrier-type> <technology-type>GoF</technology-type> <access-class>E2E</access-class> <quality-class>INP 0</quality-class> </accesselements> <servicelevelelements> <sla-name>Office hours</sla-name> </servicelevelelements> <serviceinfo> <serviceelement> <service-instance-id>SI-20007320</service-instance-id> <service-type-id>7420</service-type-id> <service-class>E2E</service-class> <e2einfo> <transport-instance-id>TI-VTEL/4</transport-instance-id> <eap-vlan-id>32</eap-vlan-id> <wap-area>WA-VTEL/97</wap-area> <wap-vlan-id>2521</wap-vlan-id> <customer-connection-tag>' +
				RFSSAvalues.RES_LA_WBA_SERVICE +
				'</customer-connection-tag> </e2einfo> </serviceelement> </serviceinfo> <errorinfo> ' +
				errorcode +
				commentcode +
				nodecode +
				' </errorinfo> </messagebody> </bsachangelinerfs>';
		if (CFSName == 'CFS_IP_ACCESS_WBA_FTTH')
			rfsChangeDataFromKPN =
				'<bsachangelinerfs> <messageheader> <originator>BUBN</originator> <recipient>VTEL</recipient> <messagetype>CHANGE_LINE_RFS</messagetype> <messageversion>52</messageversion> <timestamp>20200113171155</timestamp> </messageheader> <messagebody> <generalinfo> <order-id>P2001131710372981</order-id> <order-id-wso>' +
				wsoId +
				'</order-id-wso> <custwishdate>20200113</custwishdate> <orderreceivedatetime>20200113171020</orderreceivedatetime> </generalinfo> <actualuserinfo> <service-group>' +
				serviceInstanceID +
				'</service-group> </actualuserinfo> <orderinfo> <order-type>Change Access</order-type> <line-test-and-label>false</line-test-and-label> <outlet-required>false</outlet-required> </orderinfo> <planninginfo> <actual-tcd>' +
				yyyy +
				'' +
				mm +
				'' +
				dd +
				'</actual-tcd> <actual-ocd>' +
				yyyy +
				'' +
				mm +
				'' +
				dd +
				'</actual-ocd> </planninginfo> <accesselements> <access-instance-id>' +
				accessInstanceID +
				'</access-instance-id> <new-access-instance-id>AI-20003575/1</new-access-instance-id> <xdf-access-serviceid>PL1REF7836660574</xdf-access-serviceid> <portfolio-id>W-ADSL-WD</portfolio-id> <carrier-type>Fiber</carrier-type> <technology-type>GoF</technology-type> <access-class>E2E</access-class> <quality-class>INP 0</quality-class> </accesselements> <servicelevelelements> <sla-name>Office hours</sla-name> </servicelevelelements> <serviceinfo> <serviceelement> <service-instance-id>SI-20007320</service-instance-id> <service-type-id>7420</service-type-id> <service-class>E2E</service-class> <e2einfo> <transport-instance-id>TI-VTEL/4</transport-instance-id> <eap-vlan-id>32</eap-vlan-id> <wap-area>WA-VTEL/97</wap-area> <wap-vlan-id>2521</wap-vlan-id> <customer-connection-tag>' +
				RFSSAvalues.RES_LA_WBA_SERVICE +
				'</customer-connection-tag> </e2einfo> </serviceelement> </serviceinfo> <errorinfo> ' +
				errorcode +
				commentcode +
				nodecode +
				' </errorinfo> </messagebody> </bsachangelinerfs>';
		if (CFSName == 'CFS_IP_ACCESS_GOP_FTTH')
			rfsChangeDataFromKPN =
				'<bsachangelinerfs> <messageheader> <originator>BUBN</originator> <recipient>VTEL</recipient> <messagetype>CHANGE_LINE_RFS</messagetype> <messageversion>52</messageversion> <timestamp>20200113171155</timestamp> </messageheader> <messagebody> <generalinfo> <order-id>P2001131710372981</order-id> <order-id-wso>' +
				wsoId +
				'</order-id-wso> <custwishdate>20200113</custwishdate> <orderreceivedatetime>20200113171020</orderreceivedatetime> </generalinfo> <actualuserinfo> <service-group>' +
				serviceInstanceID +
				'</service-group> </actualuserinfo> <orderinfo> <order-type>Change Access</order-type> <line-test-and-label>false</line-test-and-label> <outlet-required>false</outlet-required> </orderinfo> <planninginfo> <actual-tcd>' +
				yyyy +
				'' +
				mm +
				'' +
				dd +
				'</actual-tcd> <actual-ocd>' +
				yyyy +
				'' +
				mm +
				'' +
				dd +
				'</actual-ocd> </planninginfo> <accesselements> <access-instance-id>' +
				accessInstanceID +
				'</access-instance-id> <new-access-instance-id>AI-20003575/1</new-access-instance-id> <xdf-access-serviceid>PL1REF7836660574</xdf-access-serviceid> <portfolio-id>W-ADSL-WD</portfolio-id> <carrier-type>Fiber</carrier-type> <technology-type>GoF</technology-type> <access-class>E2E</access-class> <quality-class>INP 0</quality-class> </accesselements> <servicelevelelements> <sla-name>Office hours</sla-name> </servicelevelelements> <serviceinfo> <serviceelement> <service-instance-id>SI-20007320</service-instance-id> <service-type-id>7420</service-type-id> <service-class>E2E</service-class> <e2einfo> <transport-instance-id>TI-VTEL/4</transport-instance-id> <eap-vlan-id>32</eap-vlan-id> <wap-area>WA-VTEL/97</wap-area> <wap-vlan-id>2521</wap-vlan-id> <customer-connection-tag>' +
				RFSSAvalues.RES_LA_WBA_SERVICE +
				'</customer-connection-tag> </e2einfo> </serviceelement> </serviceinfo> <errorinfo> ' +
				errorcode +
				commentcode +
				nodecode +
				' </errorinfo> </messagebody> </bsachangelinerfs>';
		try {
			let endpoint = CHANGE_LINE_RFS.PATH;
			let headers = {
				'Content-Type': 'text/plain',
			};
			let params = rfsChangeDataFromKPN;
			const response = await apiService.post(
				endpoint,
				headers,
				params,
				useeocApi
			);
			console.log('Response from RFS' + response);
		} catch (error) {
			console.log(JSON.stringify(error.response?.data || error.message));
		}
	};

	const sendDisconnectSaFromKPN = async (wsoId, CFSName) => {
		const useeocApi = true;
		var newdate = new Date();
		var dd = '' + newdate.getDate();
		if (newdate.getDate() < 10) dd = '0' + newdate.getDate();
		let TodaysMonths = newdate.getMonth() + 1;
		var mm = '' + TodaysMonths;
		if (TodaysMonths < 10) mm = '0' + TodaysMonths;
		var yyyy = newdate.getFullYear();
		let errorcode = '<errorcode>0</errorcode>';
		let commentcode = '<comment/>';
		let nodecode = '<order-note/>';
		let accessInstanceID = 'AI-20006535/1';
		let serviceInstanceID = 'SG-20005731';

		if (CFSName == 'CFS_IP_ACCESS_WBA_VDSL') {
			accessInstanceID = 'AI-20006957/1';
			serviceInstanceID = 'SG-20006076';
		}
		let saChangeDataFromKPN =
			'<?xml version="1.0" encoding="UTF-8"?> <disconnectlinesa> <messageheader> <originator>BUBN</originator> <recipient>VTEL</recipient> <messagetype>DISCON_LINE_SA</messagetype> <messageversion>42</messageversion> <timestamp>20200203085737</timestamp> </messageheader> <messagebody> <generalinfo> <order-id>P2002030857407679</order-id> <order-id-wso>' +
			wsoId +
			'</order-id-wso> <orderreceivedatetime>20200203085715</orderreceivedatetime> <eapid>EAP/1801012</eapid> <service-group>' +
			serviceInstanceID +
			'</service-group> </generalinfo> <orderinfo> <order-type>Disconnect Access</order-type> </orderinfo> <planninginfo> <planned-tcd>' +
			yyyy +
			'' +
			mm +
			'' +
			dd +
			'</planned-tcd> <planned-ocd>' +
			yyyy +
			'' +
			mm +
			'' +
			dd +
			'</planned-ocd> </planninginfo> <accesselements> <access-instance-id>' +
			accessInstanceID +
			'</access-instance-id> </accesselements> <serviceinfo> <serviceelement> <service-instance-id>SI-20007214</service-instance-id> <service-type-id>8608</service-type-id> <service-class>E2E</service-class> <e2einfo> <transport-instance-id>TI-VTEL/14</transport-instance-id> <eap-vlan-id>34</eap-vlan-id> <wap-area>WA-VTEL/82</wap-area> <wap-vlan-id>3089</wap-vlan-id> <customer-connection-tag>TMNLWBA100004727</customer-connection-tag> </e2einfo> </serviceelement> <serviceelement> <service-instance-id>SI-20007213</service-instance-id> <service-type-id>8419</service-type-id> <service-class>E2E</service-class> <e2einfo> <transport-instance-id>TI-VTEL/4</transport-instance-id> <eap-vlan-id>32</eap-vlan-id> <wap-area>WA-VTEL/82</wap-area> <wap-vlan-id>2489</wap-vlan-id> <customer-connection-tag>' +
			RFSSAvalues.RES_LA_WBA_SERVICE +
			'</customer-connection-tag> </e2einfo> </serviceelement> </serviceinfo> <errorinfo>  ' +
			errorcode +
			commentcode +
			nodecode +
			' </errorinfo> </messagebody> </disconnectlinesa>';

		try {
			let endpoint = DISCONNECT_LINE_SA.PATH;
			let headers = {
				'Content-Type': 'text/plain',
			};
			let params = saChangeDataFromKPN;
			const response = await apiService.post(
				endpoint,
				headers,
				params,
				useeocApi
			);
			console.log('Response from SA' + response);
		} catch (error) {
			console.log(JSON.stringify(error.response?.data || error.message));
		}
	};
	const sendDisconnectOCFromKPN = async (wsoId, CFSName) => {
		const useeocApi = true;
		var newdate = new Date();
		var dd = '' + newdate.getDate();
		if (newdate.getDate() < 10) dd = '0' + newdate.getDate();
		let TodaysMonths = newdate.getMonth() + 1;
		var mm = '' + TodaysMonths;
		if (TodaysMonths < 10) mm = '0' + TodaysMonths;
		var yyyy = newdate.getFullYear();
		let errorcode = '<errorcode>0</errorcode>';
		let commentcode = '<comment/>';
		let nodecode = '<order-note/>';
		let accessInstanceID = 'AI-20006535/1';
		let serviceInstanceID = 'SG-20005731';

		if (CFSName == 'CFS_IP_ACCESS_WBA_VDSL') {
			accessInstanceID = 'AI-20006957/1';
			serviceInstanceID = 'SG-20006076';
		}
		let saDisconnectDataFromKPN =
			'<?xml version="1.0" encoding="UTF-8"?> <disconnectlineoc> <messageheader> <originator>BUBN</originator> <recipient>VTEL</recipient> <messagetype>DISCON_LINE_OC</messagetype> <messageversion>42</messageversion> <timestamp>20200106025451</timestamp> </messageheader> <messagebody> <generalinfo> <order-id>P1912301159969271</order-id> <order-id-wso>' +
			wsoId +
			'</order-id-wso> <orderreceivedatetime>20191230115901</orderreceivedatetime> <eapid>EAP/6249003</eapid> <service-group>' +
			serviceInstanceID +
			'</service-group> </generalinfo> <orderinfo> <order-type>Disconnect Access</order-type> </orderinfo> <planninginfo> <actual-tcd>' +
			yyyy +
			'' +
			mm +
			'' +
			dd +
			'</actual-tcd> <actual-ocd>' +
			yyyy +
			'' +
			mm +
			'' +
			dd +
			'</actual-ocd> </planninginfo> <accesselements> <access-instance-id>' +
			accessInstanceID +
			'</access-instance-id> </accesselements> <serviceinfo> <serviceelement> <service-instance-id>SI-20007214</service-instance-id> <service-type-id>8608</service-type-id> <service-class>E2E</service-class> <e2einfo> <transport-instance-id>TI-VTEL/14</transport-instance-id> <eap-vlan-id>34</eap-vlan-id> <wap-area>WA-VTEL/82</wap-area> <wap-vlan-id>3089</wap-vlan-id> <customer-connection-tag>TMNLWBA100004727</customer-connection-tag> </e2einfo> </serviceelement> <serviceelement> <service-instance-id>SI-20007213</service-instance-id> <service-type-id>8419</service-type-id> <service-class>E2E</service-class> <e2einfo> <transport-instance-id>TI-VTEL/4</transport-instance-id> <eap-vlan-id>32</eap-vlan-id> <wap-area>WA-VTEL/82</wap-area> <wap-vlan-id>2489</wap-vlan-id> <customer-connection-tag>' +
			RFSSAvalues.RES_LA_WBA_SERVICE +
			'</customer-connection-tag> </e2einfo> </serviceelement> </serviceinfo> <errorinfo> ' +
			errorcode +
			commentcode +
			nodecode +
			' </errorinfo> </messagebody> </disconnectlineoc>';
		try {
			let endpoint = DISCONNECT_LINE_OC.PATH;
			let headers = {
				'Content-Type': 'text/plain',
			};
			let params = saDisconnectDataFromKPN;
			const response = await apiService.post(
				endpoint,
				headers,
				params,
				useeocApi
			);
			console.log('Response from OC' + response);
		} catch (error) {
			console.log(JSON.stringify(error.response?.data || error.message));
		}
	};
	const handleMenuClick = (e) => {
		setSelectedOrderType(e.item.props.children);
	};

	const wbaDateChange = (date, dateString) => {
		console.log(date, dateString);
	};

	const menu = (
		<Menu onClick={handleMenuClick}>
			<Menu.Item key="1">New line</Menu.Item>
			<Menu.Item key="2">Change</Menu.Item>
			<Menu.Item key="3">Disconnect</Menu.Item>
			<Menu.Item key="4">Cancel</Menu.Item>
			<Menu.Item key="5">Revise</Menu.Item>
			<Menu.Item key="6">Migrate out</Menu.Item>
			<Menu.Item key="7">New Delay</Menu.Item>
		</Menu>
	);

	return (
		<div className="background-container">
			<div className="orderid-custom-div">
				<Row gutter={[24, 24]} className="orderid-row">
					<Col
						xs={24}
						sm={12}
						md={8}
						lg={8}
						className="orderid-label"
					>
						<h3>Order ID:</h3>
					</Col>
					<Col xs={24} sm={12} md={8} lg={16}>
						<Input
							className="orderid-textbox"
							value={orderId}
							onChange={(e) => {
								setOrderId(e.target.value);
							}}
						/>
					</Col>
				</Row>
			</div>
			<div className="container-async">
				<Row gutter={[16, 16]} className="custom-row">
					<Col xs={24} sm={24} md={24} lg={8} className="custom-col">
						<Card title="WBA Async Messages" bordered={false}>
							{/* Nested Card */}
							<Card bordered={false} className="async-inner-card">
								<Row>
									<Col
										xs={24}
										sm={24}
										md={24}
										lg={8}
										className="col-item"
									>
										<h5>Error Code:</h5>
										<Input
											placeholder="Error Code"
											type="text"
											name="errorCode"
											value={wbaMessages.errorCode}
											onChange={handleWbaMessagesChange}
										/>
									</Col>
									<Col xs={24} sm={24} md={24} lg={10}>
										<h5>Order Note:</h5>
										{/* Textarea */}
										<Input.TextArea
											placeholder="Textarea"
											rows={4}
											type="text"
											name="orderNote"
											value={wbaMessages.orderNote}
											onChange={handleWbaMessagesChange}
										/>
									</Col>
								</Row>
								<Row>
									<Col
										xs={24}
										sm={24}
										md={24}
										lg={8}
										className="col-item"
									>
										<h5>Comment Code:</h5>
										<Input
											placeholder="Comment Code"
											type="text"
											name="commentCode"
											value={wbaMessages.commentCode}
											onChange={handleWbaMessagesChange}
										/>
									</Col>
									<Col xs={24} sm={24} md={24} lg={10}>
										<h5>Service Group:</h5>
										<Input
											placeholder="Service Group"
											type="text"
											name="serviceGroup"
											value={wbaMessages.serviceGroup}
											onChange={handleWbaMessagesChange}
										/>
									</Col>
								</Row>
							</Card>
							<Card bordered={false} className="async-inner-card">
								<Row gutter={[16, 16]}>
									<Col xs={24} sm={12} md={8} lg={5}>
										<h5>Select Order Type:</h5>
									</Col>
									<Col xs={24} sm={12} md={8} lg={6}>
										<Dropdown overlay={menu}>
											<Button className="ordertype-dropdown">
												{selectedOrderType}
												<DownOutlined />
											</Button>
										</Dropdown>
									</Col>
								</Row>
								<Row
									gutter={[24, 24]}
									className="async-date-button-row"
								>
									<Col
										xs={24}
										sm={12}
										md={8}
										lg={6}
										className="async-col"
									>
										<DatePicker
											className="datefield"
											onChange={wbaDateChange}
										/>
									</Col>
									<Col
										xs={24}
										sm={12}
										md={8}
										lg={6}
										className="async-col"
									>
										<Button
											type="primary"
											className="async-triggers-button"
											onClick={() =>
												onWBAAsyncSubmit('SA')
											}
										>
											NEW_SA
										</Button>
									</Col>
									<Col
										xs={24}
										sm={12}
										md={8}
										lg={6}
										className="async-col"
									>
										<Button
											type="primary"
											className="async-triggers-button"
											onClick={() =>
												onWBAAsyncSubmit('RFS')
											}
										>
											NEW_RFS
										</Button>
									</Col>
								</Row>
							</Card>
						</Card>
					</Col>
				</Row>
				<Row gutter={[16, 16]} className="custom-row">
					<Col xs={24} sm={24} md={24} lg={8} className="custom-col">
						<Card title="BSS Async Triggers" bordered={false}>
							<Button
								type="primary"
								className="bss-async-triggers-button"
							>
								Resume Pending
							</Button>
							<Button
								type="primary"
								className="bss-async-triggers-button"
							>
								SIM Activation Successful
							</Button>
							<Button
								type="primary"
								className="bss-async-triggers-button"
							>
								SIM Activation Failed
							</Button>
						</Card>
					</Col>
				</Row>
				<Row gutter={[16, 16]} className="custom-row">
					<Col xs={24} sm={24} md={24} lg={8} className="custom-col">
						<Card title="FC Async Triggers" bordered={false}>
							<Row>
								<Button
									type="primary"
									className="fc-async-triggers-button"
								>
									Order Creation
								</Button>
								<Button
									type="primary"
									className="fc-async-triggers-button"
								>
									Appointment Planner
								</Button>
								<Button
									type="primary"
									className="fc-async-triggers-button"
								>
									Order Completed
								</Button>
							</Row>
							<Row
								justify="center"
								align="middle"
								className="appointment-date"
							>
								<Col span={8}>
									<DatePicker />
								</Col>
							</Row>
							<Row>
								<Button
									type="primary"
									className="fc-async-triggers-button"
								>
									Order Creation
								</Button>
							</Row>
						</Card>
					</Col>
				</Row>
			</div>
		</div>
	);
};

export default AsyncMessages;
