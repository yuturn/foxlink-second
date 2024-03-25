import React, { useState, useEffect } from 'react';

const MyComponent = () => {
  const [data, setData] = useState(null);
  const [reloadFlag, setReloadFlag] = useState(false); // 定义一个状态来触发更新

  // 封装获取数据的逻辑
  const fetchData = async () => {
    try {
      const response = await apiGetSomeData(); // 假设这是你的API调用
      setData(response.data); // 更新状态以反映新的数据
    } catch (error) {
      console.error("获取数据失败:", error);
      // 这里可以处理错误，比如设置错误状态或显示错误消息
    }
  };

  // 使用useEffect来响应reloadFlag状态的改变
  useEffect(() => {
    fetchData();
  }, [reloadFlag]); // 将reloadFlag作为依赖，这样它的改变会触发useEffect

  // 定义一个函数来处理按钮点击，它将改变reloadFlag的值
  const handleReloadButtonClick = () => {
    setReloadFlag(prevFlag => !prevFlag); // 改变reloadFlag的值以触发重新渲染
  };

  return (
    <div>
      {/* 在这里显示你的数据 */}
      <button onClick={handleReloadButtonClick}>刷新数据</button>
    </div>
  );
};
