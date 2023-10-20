import axios from 'axios';
import { useNavigate } from "react-router-dom";


const baseRequest = axios.create({
  baseURL: process.env.REACT_APP_BASEURL,
  headers: { "Access-Control-Allow-Origin": "*" },
  timeout: 300000,
});

const auth_except = (x) => x.catch((e) => {
  if (e.response.status == 403) {
    //alert('无法验证身份');
    alert(e.response.statusText);
  }
  throw e;
})

// ============================第二期============================
// $5$rounds=10000$F0XL1NKPWDHaSH$x7OJPMIuQs3XFigY6rsIzhYVDezZa0i3O1qZrDemcm5
export const apiConfirmedUser = (data) => auth_except(baseRequest.post(`/users/create-user`, data, {
  headers:
  {
    'accept': 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded'
  }
}));

export const apiGetPeddingList = (token) => auth_except(baseRequest.get(`/users/pending-approvals-list`, {
  headers:
  {
    'accept': 'application/json',
    'Authorization': `Bearer ${token}`
  }
}));

export const apiPostPeddingList = (data) => auth_except(baseRequest.post(`/users/pending-approval-user`, data, {
  headers:
  {
    'accept': 'application/json',
    'Content-Type': 'application/json'
  }
}));

export const apiGetProjectDevices = (data) => auth_except(baseRequest.get(`project/search-project-devices?project_name=${data['name']}`, {
  headers:
  {
    'accept': 'application/json',
    'Content-Type': 'application/json'
  }
}));

export const apiPostProjectDevices = (data) => auth_except(baseRequest.post(`project/add-project-events`, data, {
  headers:
  {
    'accept': 'application/json',
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
}));
// ============================第二期============================

export const apiSystemSpace = (token) => auth_except(baseRequest.get('/system/space', {
  headers: {
    'accept': 'application/json',
    'Authorization': `Bearer ${token}`
  }
}));

export const apiUserLogin = (data) => auth_except(baseRequest.post('/auth/token', data, {
  headers:
  {
    'accept': 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  timeout: 30000,
}));
export const apiUserLevel = (token) => auth_except(baseRequest.get('/users/info', {
  headers: {
    'accept': 'application/json',
    'Authorization': `Bearer ${token}`
  }
}));

export const apiStatisticsWithDate = (data) => auth_except(baseRequest.get(`/stats/?workshop_name=${data['workshop']}&start_date=${data['start']}&end_date=${data['end']}`, {
  headers:
  {
    'accept': 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded'
  }
}));


// export const apiStatisticsWithDate = (data) => auth_except(baseRequest.get(`/stats/?workshop_name=${data['workshop']}&start_date=${data['start']}&end_date=${data['end']}`, {
//   headers:
//   {
//     'accept': 'application/json',
//     'Content-Type': 'application/x-www-form-urlencoded'
//   }

export const apiStatisticsWithShift = (data) => auth_except(baseRequest.get(`/stats/?workshop_name=${data['workshop']}&start_date=${data['start']}&end_date=${data['end']}&is_night_shift=${data['shift']}`, {
  headers:
  {
    'accept': 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded'
  }

}));

/*
*
* FQ-9%E8%BB%8A%E9%96%93 新改 ＡＰＩ
*
*/
export const apiWorkStatus = (workshop) => auth_except(baseRequest.get(`/stats/${workshop}/worker-status`, {
  headers: {
    'accept': 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  timeout: 60000,
}));

export const apiMissionNeedRepair = (data) => auth_except(baseRequest.get(`missions/?workshop_name=${data['workshop']}&is_worker_null=true&is_done=false`, {
  headers: {
    'accept': 'application/json',
    'Authorization': `Bearer ${data['token']}`
  }
}));
export const apiMissionEmergency = (data) => auth_except(baseRequest.get(`missions/?workshop_name=${data['workshop']}&is_started=false&is_done=false&is_emergency=true`, {
  headers: {
    'accept': 'application/json',
    'Authorization': `Bearer ${data['token']}`
  }
}));

// List
export const apiWorkShopList = (token) => auth_except(baseRequest.get('/workshop/list', {
  headers: {
    'accept': 'application/json',
    'Authorization': `Bearer ${token}`
  }
}));
export const apiProjectList = (data) => auth_except(baseRequest.get(`workshop/${data['workshopname']}/projects`, {
  headers: {
    'accept': 'application/json',
    'Authorization': `Bearer ${data['token']}`
  }
}));

export const apiQRCode = (data) => auth_except(baseRequest.get(`/workshop/qrcode?workshop_name=${data['name']}`, {
  headers:
  {
    'accept': 'application/x-zip-compressed',
    'Authorization': `Bearer ${data['token']}`
  },
  responseType: 'blob'
}));

export const apiMapGet = (data) => auth_except(baseRequest.get(`/workshop/${data['name']}/image`, {
  headers:
  {
    'accept': 'application/json',
    'Authorization': `Bearer ${data['token']}`
  },
  responseType: 'arraybuffer'
}));
export const apiMapPost = (data) => auth_except(baseRequest.post(`/workshop/${data['name']}/image`, data['file'], {
  headers:
  {
    'accept': 'application/json',
    'Content-Type': 'multipart/form-data',
    'Authorization': `Bearer ${data['token']}`
  }
}));

export const apiGetFileName = (data) => auth_except(baseRequest.get(`/workshop/filename`, {
  headers:
  {
    'accept': 'application/json',
    'Authorization': `Bearer ${data['token']}`
  },
}));

export const apiEventbook = (data) => auth_except(baseRequest.post('/migration/workshop-eventbook', data['file'], {
  headers:
  {
    'accept': 'application/json',
    'Content-Type': 'multipart/form-data',
    'accept': 'application/json',
    'Authorization': `Bearer ${data['token']}`
  }
}));
export const apiEventbookGet = (data) => auth_except(baseRequest.get(`/device/category-priority?workshop_name=${data['workshop']}&project=${data['project']}`, {
  headers:
  {
    'accept': 'application/json',
    'Authorization': `Bearer ${data['token']}`
  },
}));

export const apiDevices = (data) => auth_except(baseRequest.post('/migration/devices', data['file'], {
  headers:
  {
    'accept': 'application/json',
    'Content-Type': 'multipart/form-data',
    'accept': 'application/json',
    'Authorization': `Bearer ${data['token']}`
  }
}));
export const apiDevicesData = (data) => auth_except(baseRequest.get(`/device/?workshop_name=${data['name']}`, {
  headers:
  {
    'accept': 'application/json',
    'Authorization': `Bearer ${data['token']}`
  }
}));

export const apiWorkerinfos = (data) => auth_except(baseRequest.post('/migration/factory-worker-infos', data['file'], {
  headers:
  {
    'accept': 'application/json',
    'Content-Type': 'multipart/form-data',
    'accept': 'application/json',
    'Authorization': `Bearer ${data['token']}`
  }
}));
export const apiWorkerAll = (data) => auth_except(baseRequest.get(`/users/overview?workshop_name=${data['workshop']}`,
  {
    headers:
    {
      'accept': 'application/json',
      'Authorization': `Bearer ${data['token']}`
    }
  }));

// white list
export const apiGetWhiteList = (workshop_name) => auth_except(baseRequest.get(`/device/whitelist?workshop_name=${workshop_name}`, {
  headers: {
    'accept': 'application/json',
  }
}));
export const apiGetDeviceRecommend = (workshop_name) => auth_except(baseRequest.get(`/device/whitelist/recommend?workshop_name=${workshop_name}`, {
  headers: {
    'accept': 'application/json',
  }
}));
export const apiGetDeviceNameById = (data) => auth_except(baseRequest.get(`/device/${data['device_id']}`, {
  headers:
  {
    'accept': 'application/json',
    'Authorization': `Bearer ${data['token']}`
  }
}));
export const apiGetWorkersByDevice = (data) => auth_except(baseRequest.get(`/device/${data['device_id']}/workers?shift_type=${data['shift']}`, {
  headers: {
    'accept': 'application/json',
  }
}));
export const apiPostAddWorkersWhitelist = (data) => auth_except(baseRequest.post(`/device/${data['device_id']}/whitelist?username=${data['username']}`, {
  headers: {
    'accept': 'application/json',
  }
}));
export const apiDeleteWorkersWhitelist = (data) => auth_except(baseRequest.delete(`/device/${data['device_id']}/whitelist?username=${data['username']}`, {
  headers: {
    'accept': 'application/json',
  }
}));

export const apiGetSystemEnvSetting = (data) => auth_except(baseRequest.get(`/system/env-get-settings/${data['key']}`, {
  headers:
  {
    'accept': 'application/json',
    'Authorization': `Bearer ${data['token']}`
  }
}));

export const apiPostSystemEnvSetting = (data) => auth_except(baseRequest.post(`/system/env-update-settings/${data['key']}?value=${data['value']}`, data, {
  headers:
  {
    'accept': 'application/json',
    'Authorization': `Bearer ${data['token']}`
  }
}));

export const apiGetSystemEnvSettingCount = (data) => auth_except(baseRequest.get(`/system/env-get-settings/${data['key']}`, {
  headers:
  {
    'accept': 'application/json',
    'Authorization': `Bearer ${data['token']}`
  }
}));

export const apiPostSystemEnvSettingCount = (data) => auth_except(baseRequest.post(`/system/env-update-settings/${data['key']}?value=${data['value']}`, data, {
  headers:
  {
    'accept': 'application/json',
    'Authorization': `Bearer ${data['token']}`
  }
}));

export const apiGetSystemEnvSettingInterval = (data) => auth_except(baseRequest.get(`/system/env-get-settings/${data['key']}`, {
  headers:
  {
    'accept': 'application/json',
    'Authorization': `Bearer ${data['token']}`
  }
}));

export const apiPostSystemEnvSettingInterval = (data) => auth_except(baseRequest.post(`/system/env-update-settings/${data['key']}?value=${data['value']}`, data, {
  headers:
  {
    'accept': 'application/json',
    'Authorization': `Bearer ${data['token']}`
  }
}));
