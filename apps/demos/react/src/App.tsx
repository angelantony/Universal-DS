import { useState, type SubmitEvent } from 'react';
import { UdsButton } from '@uds/react';

export function App() {
  const [count, setCount] = useState(0);
  const [submitted, setSubmitted] = useState('no');
  const [disabledCount, setDisabledCount] = useState(0);

  function onSubmit(event: SubmitEvent<HTMLFormElement>): void {
    event.preventDefault();
    setSubmitted('yes');
  }

  return (
    <>
      <UdsButton
        id="label-button"
        tone="danger"
        variant="outline"
        onClick={() => {
          setCount((value) => value + 1);
        }}
      >
        Save
      </UdsButton>
      <p id="count">{count}</p>
      <form id="demo-form" onSubmit={onSubmit}>
        <input id="title" name="title" />
        <UdsButton id="submit-button" type="submit">
          Submit
        </UdsButton>
        <UdsButton id="reset-button" type="reset">
          Reset
        </UdsButton>
      </form>
      <p id="submitted">{submitted}</p>
      <UdsButton
        id="disabled"
        disabled
        onClick={() => {
          setDisabledCount((value) => value + 1);
        }}
      >
        Disabled
      </UdsButton>
      <p id="disabled-count">{disabledCount}</p>
    </>
  );
}
