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

export const apiGetProjectName = (token) => auth_except(baseRequest.get(`/project/`, {
  headers:
  {
    'accept': 'application/json',
    'Authorization': `Bearer ${token}`
  }
}));
// 修正后的 apiPostAutoTrain 函数
export const apiPostAutoTrain = (data) => {
  return auth_except(baseRequest.post(
    `/scheduler/auto_train?preprocessing_months=${data['preprocessing_months']}&months_before_retrain=${data['months_before_retrain']}&description=${encodeURIComponent(data['description'])}`,
    null, // 保持请求体为空，因为查询参数在 URL 中
    {
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${data['token']}`
      }
    }
  ));
}

////////////////////////////////////
export const apiMarquee = (token) => auth_except(baseRequest.get(`/system/search-timestamp`, {
  headers:
  {
    'accept': 'application/json',
    'Authorization': `Bearer ${token}`,
  }
}));
////////////////////////////////////
export const apiDeleteProject = (data) => auth_except(baseRequest.delete(`/project/`, {
  headers:
  {
    'accept': 'application/json',
    'Authorization': `Bearer ${data['token']}`
  },
  data: data.project
}));

////////////////////////////////////專案管理的list會有下拉式選單然後點了會顯示專案內容
export const apiGetProjectTable = (token) => auth_except(baseRequest.get(`/project/tables`, {
  headers:
  {
    'accept': 'application/json',
    'Authorization': `Bearer ${token}`
  }
}));
////////////////////////////////////
export const apiGetProjectDevices = (data) => auth_except(baseRequest.get(`/project/search-project-devices?project_name=${data['name']}`, {
  headers:
  {
    'accept': 'application/json',
    'Content-Type': 'application/json'
  }
}));

export const apiPostProjectDevices = (data) => auth_except(baseRequest.post(`/project/add-project-events?start_date=${data['startDate']}`, data['project'], {
  headers:
  {
    'accept': 'application/json',
    'Authorization': `Bearer ${data['token']}`,
    'Content-Type': 'application/json'
  },
  // data: data.project
}));
export const apiPostAdminProjectDevices = (data) => auth_except(baseRequest.post(`/project/project`, data['project'], {
  headers:
  {
    'accept': 'application/json',
    'Authorization': `Bearer ${data['token']}`,
    'Content-Type': 'application/json'
  }
}));
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbiIsIlVVSUQiOm51bGwsImV4cCI6MTcxMTkzNzMyMn0.LOLLK_PWs8zZyYpjOqVh3tIgGkx1-C1GI1TgOTTjwjE (V)
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbiIsIlVVSUQiOm51bGwsImV4cCI6MTcxMTg5ODU3Nn0.yzOEH9fdcUW-gGZIiho72PlHq6W1GG4F1e6eOJNgbiw (V)
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbiIsIlVVSUQiOiIxMjMiLCJleHAiOjE3MTE5MzY1NjJ9.KnTtqhOkIiavgp6nD5J_0Ha-_0JZwyZnfXfNGlvptXw (X)
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbiIsIlVVSUQiOiIxMjMiLCJleHAiOjE3MTE5MzY4Nzl9.a7nic7FpCvVXIpmbMOGDvMWfqxz8qEFAOqR8YKL0lAw (X)
export const apiDeleteAdminProjectDevices = (data) => auth_except(baseRequest.delete(`/project/project`, {
  headers:
  {
    'accept': 'application/json',
    'Authorization': `Bearer ${data['token']}`,
    'Content-Type': 'application/json'
  },
  data: [data.project]
}));

// export const apiGetProjectprogress = (data) => auth_except(baseRequest.get(`/project/task?project_name=${data['name']}&action=${data['action']}&status=${data['progress']}`, {
//   headers:
//   {
//     'accept': 'application/json',
//     'Authorization': `Bearer ${data['token']}`,
//   }
// }));

export const apiGetProjectprogress = (token) => auth_except(baseRequest.get(`/project/task`, {
  headers:
  {
    'accept': 'application/json',
    'Authorization': `Bearer ${token}`,
  }
}));

export const apiGetProjectUsers = (data) => auth_except(baseRequest.get(`/project/users?project_id=${data['projectID']}`, {
  headers:
  {
    'accept': 'application/json',
    'Authorization': `Bearer ${data['token']}`,
  }
}));

export const apiGetUserName = (data) => auth_except(baseRequest.get(`/users/foxlink?user_id=${data['userID']}&system_id=${data['systemID']}`, {
  headers:
  {
    'accept': 'application/json',
    // 'Authorization': `Bearer ${data['token']}`,
  }
}));

// update
export const apiPostProjectUser = (data) => auth_except(baseRequest.post(`/project/add-project-worker`, data, {
  headers:
  {
    'accept': 'application/json',
    'Authorization': `Bearer ${data['token']}`
  }
}));

export const apiDeleteProjectUser = (data) => auth_except(baseRequest.delete(`/project/remove-project-worker?project_id=${data['projectID']}&user_id=${data['userID']}`, {
  headers:
  {
    'accept': 'application/json',
    'Authorization': `Bearer ${data['token']}`
  }
}));

export const apiGetProjectUserBelong = (data) => auth_except(baseRequest.get(`/project/user-projects?user_id=${data['user_id']}`, {
  headers:
  {
    'accept': 'application/json',
    'Authorization': `Bearer ${data['token']}`
  }
}));
export const apiDeleteProjectUserBelong = (data) => auth_except(baseRequest.delete(`/project/user-projects?user_id=${data['user_id']}`, {
  headers:
  {
    'accept': 'application/json',
    'Authorization': `Bearer ${data['token']}`,
    'Content-Type': 'application/json'
  },
  data: [data.project_id]
}));
export const apiGetStatistics = (token) => auth_except(baseRequest.get(`/statistics/`, {
  headers:
  {
    'accept': 'application/json',
    'Authorization': `Bearer ${token}`,
  }
}));


export const apiGetStatisticsDetails = (data) => auth_except(baseRequest.get(`statistics/predict_result`, {
  headers:
  {
    'accept': 'application/json',
    'Authorization': `Bearer ${data['token']}`,
  }
}));

export const apiGetStatisticsDetailsFilter = (data) => {
  const url = `statistics/predict_result${data.projectName ? "?project_name=" + data.projectName : ""}${data.lineName ? "&line=" + data.lineName : ""}${data.deviceName ? "&device_name=" + data.deviceName : ""}`;
  return auth_except(baseRequest.get(url, {
    headers: {
      'accept': 'application/json',
      'Authorization': `Bearer ${data['token']}`,
    }
  }));
}


export const apiGetCompareList = (token) => auth_except(baseRequest.get(`/statistics/predict-compare-list`, {
  headers:
  {
    'accept': 'application/json',
    'Authorization': `Bearer ${token}`,
  }
}));
//data['line'] ? 判定的逻辑是如果 data['line'] 存在且不为 null、undefined 或空字符串，则返回 true；否则，返回 false。
export const apiGetCompareSearch = (data) => auth_except(baseRequest.get(`/statistics/predict-compare-search?start_time=${data['startDate']}&end_time=${data['endDate']}&select_type=${data['type']}${data['project_name'] ? "&project_name=" + data['project_name'] : ""}${data['line'] ? "&line=" + data['line'] : ""}`, {
  headers:
  {
    'accept': 'application/json',
    'Authorization': `Bearer ${data['token']}`,
  }
}));

export const apiGetCompareDetail = (data) => auth_except(baseRequest.get(`statistics/predict-compare-detail?project_name=${data['project_name']}&device_name=${data['device_name']}&line=${data['line']}&date=${data['date']}&select_type=${data['type']}`, {
  headers:
  {
    'accept': 'application/json',
    'Authorization': `Bearer ${data['token']}`,
  }
}));

export const apiGetCompareAnalysis = (data) => auth_except(baseRequest.get(`statistics/predict-compare-analysis?project_name=${data['project_name']}&line=${data['line']}&select_type=${data['type']}&start_date=${data['startDate']}&end_date=${data['endDate']}`, {
  headers:
  {
    'accept': 'application/json',
    'Authorization': `Bearer ${data['token']}`,
  }
}));

export const apiGetLOG = (data) => auth_except(baseRequest.get(`logs/?${data['action'] ? "action=" + data['action'] + "&" : ""}${data['projectName'] ? "projectName=" + data['projectName'] + "&" : ""}${data['userName'] ? "username=" + data['userName'] + "&" : ""}${data['limit'] ? "limit=" + data['limit'] + "&" : ""}${data['page'] ? "page=" + data['page'] + "&" : ""}${data['startDate'] ? "start_date=" + data['startDate'] + "&" : ""}${data['badge'] ? "badge=" + data['badge'] + "&" : ""}${data['endDate'] ? "end_date=" + data['endDate'] : ""}`, {
  headers:
  {
    'accept': 'application/json',
    'Authorization': `Bearer ${data['token']}`,
  }
}));

export const apiPostFullBackUp = (data) => auth_except(baseRequest.post(`/backup/${data['path'] ? "?path=" + data['path'] : ""}`, data, {
  headers:
  {
    'accept': 'application/json',
    'Authorization': `Bearer ${data['token']}`
  }
}));

export const apiGetSystemEnvSetting = (data) => auth_except(baseRequest.get(`/system/env-settings?key=${data['key']}`, {
  headers:
  {
    'accept': 'application/json',
    'Authorization': `Bearer ${data['token']}`,
  }
}));

export const apiPostUpdateSetting = (data) => auth_except(baseRequest.post(`/system/update-settings?key=${data['key']}&value=${data['path']}`, data, {
  headers:
  {
    'accept': 'application/json',
    'Authorization': `Bearer ${data['token']}`
  }
}));

export const apiPostSchedulerDate = (data) => auth_except(baseRequest.post(`/scheduler/date?time=${data['time']}`, data, {
  headers:
  {
    'accept': 'application/json',
    // 'Authorization': `Bearer ${data['token']}`
  }
}));

export const apiPostSchedulerCron = (data) => auth_except(baseRequest.post(`/scheduler/cron?time=${data['time']}&select_type=${data['select_type']}&description=${data['description']}`, data, {
  headers:
  {
    'accept': 'application/json',
    // 'Authorization': `Bearer ${data['token']}`
  }
}));

export const apiPostRestoreBackUp = (data) => auth_except(baseRequest.post(`/backup/restore-backup?path=${data['path']}`, data, {
  headers:
  {
    'accept': 'application/json',
    'Authorization': `Bearer ${data['token']}`
  }
}));

export const apiGetBackUpStatistics = (data) => auth_except(baseRequest.get(`/backup/statistics`, {
  headers:
  {
    'accept': 'application/json',
    'Authorization': `Bearer ${data['token']}`,
  }
}));
// $5$rounds=10000$F0XL1NKPWDHaSH$x7OJPMIuQs3XFigY6rsIzhYVDezZa0i3O1qZrDemcm5
// ============================第二期============================

export const apiSystemSpace = (token) => auth_except(baseRequest.get('/system/space', {
  headers: {
    'accept': 'application/json',
    'Authorization': `Bearer ${token}`
  }
}));

export const apiGetHomePage = (token) => auth_except(baseRequest.get(`/statistics/homepage`, {
  headers:
  {
    'accept': 'application/json',
    'Authorization': `Bearer ${token}`,
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

// export const apiGetSystemEnvSetting = (data) => auth_except(baseRequest.get(`/system/env-get-settings/${data['key']}`, {
//   headers:
//   {
//     'accept': 'application/json',
//     'Authorization': `Bearer ${data['token']}`
//   }
// }));

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
