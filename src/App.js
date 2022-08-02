import React, { useEffect, useState } from "react";

import Tasks from "./components/Tasks/Tasks";
import NewTask from "./components/NewTask/NewTask";
import useHttp from "./hooks/use-http";

function App() {
  const [tasks, setTasks] = useState([]);

  const transformTasks = (tasksObj) => {
    const loadedTasks = [];

    for (const taskKey in tasksObj) {
      loadedTasks.push({ id: taskKey, text: tasksObj[taskKey].text });
    }
    setTasks(loadedTasks);
  };
  // 주요 로직은 커스텀훅에 위치하고, 로직에 대한 데이터는 그 데이터를 필요로하는 컴포넌트에 위치하기 때문에 명확하다.

  // 데이터를 가져오기만 하는 GET요청 시에는 헤더와 바디가 필요 없다.
  const httpData = useHttp(
    {
      url: "https://react-http-4bb01-default-rtdb.firebaseio.com/tasks.json",
    },
    transformTasks
  );

  const { isLoading, error, sendRequest: fetchTasks } = httpData;
  // httpData 의 리턴 중 sendReqeust를 fetchTasks라는 이름으로 받겠다는 뜻

  useEffect(() => {
    fetchTasks();
  }, []);

  const taskAddHandler = (task) => {
    setTasks((prevTasks) => prevTasks.concat(task));
  };

  return (
    <React.Fragment>
      <NewTask onAddTask={taskAddHandler} />
      <Tasks
        items={tasks}
        loading={isLoading}
        error={error}
        onFetch={fetchTasks}
      />
    </React.Fragment>
  );
}

export default App;
