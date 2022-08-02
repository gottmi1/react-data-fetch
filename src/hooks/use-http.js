import React, { useState, useCallback } from "react";

const useHttp = (applyData) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendRequest = useCallback(
    async (requestConfig) => {
      setIsLoading(true);
      setError(null);
      // 여기서 set함수를 호출해 상태 변화가 일어나게 되면 이 커스텀 훅을 사용하는 컴포넌트에 재평가를 일으켜 리렌더링이 일어남.
      try {
        const response = await fetch(
          // "https://react-http-4bb01-default-rtdb.firebaseio.com/tasks.json" requestConfig라는 객체를 줘서 유연하게 사용할 수 있도록 만든다
          requestConfig.url,
          {
            method: requestConfig.method ? requestConfig.method : "GET",
            headers: requestConfig.headers ? requestConfig.headers : {},
            body: requestConfig.body
              ? JSON.stringify(requestConfig.body)
              : null,
          }
        );

        if (!response.ok) {
          throw new Error("Request failed!");
        }

        const data = await response.json();
        applyData(data);
        // 데이터를 처리하는 부분은 일반적이지 않고 너무 구체적인 부분이기 때문에 hooks에서 다루면 안된다. 대신 데이터를 받으면, 이 훅을 사용하는 컴포넌트로부터 얻은 함수를 실행하여, 그 함수에 데이터를 넘기는 방식을 사용한다.

        // 훅에서 applyData로 data를 전달할 것이고, 함수안에서 무엇이 발생할지는 이 훅을 사용하는 컴포넌트에서 정해진다.
      } catch (err) {
        setError(err.message || "Something went wrong!");
      }

      setIsLoading(false);
    },
    [applyData]
  );

  return {
    isLoading: isLoading,
    error: error,
    sendRequest: sendRequest,
  };
};

export default useHttp;
