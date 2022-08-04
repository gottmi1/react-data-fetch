import useHttp from "../../hooks/use-http";

import Section from "../UI/Section";
import TaskForm from "./TaskForm";

const NewTask = (props) => {
  const { isLoading, error, sendRequest: sendTaskRequest } = useHttp();

  const createTask = (taskText, taskData) => {
    const generatedId = taskData.name; // firebase-specific => "name" contains generated id
    const createdTask = { id: generatedId, text: taskText };

    props.onAddTask(createdTask);
  };

  const enterTaskHandler = async (taskText) => {
    sendTaskRequest(
      {
        url: "https://react-http-4bb01-default-rtdb.firebaseio.com/tasks.json",
        method: "POST",
        body: { text: taskText },
        // body의 json변환은 커스텀훅에서 하기 때문에 스트링지파이는 제거 해준다.
        headers: {
          "Content-Type": "application/json",
        },
      },
      createTask.bind(null, taskText)
      // bind 메서드로 호출 즉시 실행하게 하지 않고 함수를 사전에 생성 후 반환만 해 놓을 수 있음. 첫 번쨰 인자로 받는 것은  실행 예정된 함수에서 this.arg같은 건데 이 상황에선 필요없으므로 null을 준다. 두번째 인자는 호출 예정인 함수가 받는 첫 번쨰 인자이다.(createTask의 taskText자리). bind의 영향으로 커스텀훅의 applyData가 받는 data가 createTask의 두 번째 인자인 taskData로 들어감.
    );
  };

  return (
    <Section>
      <TaskForm onEnterTask={enterTaskHandler} loading={isLoading} />
      {error && <p>{error}</p>}
    </Section>
  );
};

export default NewTask;
