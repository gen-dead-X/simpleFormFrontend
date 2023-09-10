const userImputs = document.querySelectorAll(".user-input");
const selectedOptions = document.querySelectorAll("select");

const formValueObject = {};

async function handleSubmit(event) {
  event.preventDefault();

  userImputs.forEach((input) => {
    formValueObject[input.id] = input.value;
  });
  selectedOptions.forEach((option) => {
    formValueObject[option.id] = option.value;
  });

  const response = await postData(
    "http://localhost:4000/new-form-submission",
    formValueObject
  );

  if (response) {
    console.log(response);
    console.log("Succesfully submitted");
  }
}

async function postData(url = "", data = {}) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formValueObject),
  });

  return response.json();
}
