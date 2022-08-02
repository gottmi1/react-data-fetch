import React, { useCallback, useEffect, useState } from "react";

import Tasks from "./components/Tasks/Tasks";
import NewTask from "./components/NewTask/NewTask";
import useHttp from "./hooks/use-http";

function App() {
  const [tasks, setTasks] = useState([]);
  // 이와 같이 작성하면, 주요 로직은 커스텀훅에 위치하고, 로직에 대한 데이터는 그 데이터를 필요로하는 컴포넌트에 위치하기 때문에 명확하다.
  const transformTasks = useCallback((tasksObj) => {
    const loadedTasks = [];

    for (const taskKey in tasksObj) {
      loadedTasks.push({ id: taskKey, text: tasksObj[taskKey].text });
    }
    setTasks(loadedTasks);
  }, []);
  // transformTasks의 디펜던시는 비워놓아도 되는데, 함수 내부에서 상태갱신을 위한 useState외에는 외부에서 가져와서 사용하는 게 없기 때문. 그리고 상태는 불변성을 보장하기 때문에 디펜던시를 비워도 되는 것.

  // 데이터를 가져오기만 하는 GET요청 시에는 헤더와 바디가 필요 없다.
  const httpData = useHttp(transformTasks);

  const { isLoading, error, sendRequest: fetchTasks } = httpData;
  // httpData 의 리턴 중 sendReqeust를 fetchTasks라는 이름으로 받겠다는 뜻

  useEffect(() => {
    fetchTasks({
      url: "https://react-http-4bb01-default-rtdb.firebaseio.com/tasks.json",
    });
  }, [fetchTasks]);
  // 이렇게 설정한 경우, fetchTasks함수는 fetchTasks에 변경이 있을 때 재실행되게 되는데, 함수는 실행될 때마다 재생성되며, 완전히 같은 구조를 가지고 있다고 해도 다른 객체로 취급되기 떄문에 무한 루프가 일어난다(변경 -> 실행 -> 변경의 무한 루프)

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
