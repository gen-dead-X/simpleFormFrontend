const allFormContainer = document.querySelector(".all-forms-container");
const body = document.querySelector("body");
const formContainer = document.querySelector(".edit-form-container");

(async () => {
  try {
    let response = await fetch("http://localhost:4000/get-form-datas", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    response = await response.json();

    if (!response.success) {
      throw new Error("Error: Failed to fetch data");
    }

    appendForData(response.data);
  } catch (error) {
    console.log(error);
  }
})();

function appendForData(data) {
  data.forEach((form) => {
    const formDiv = document.createElement("div");
    formDiv.classList.add("form-data");
    const username = document.createElement("p");
    const email = document.createElement("p");
    const createdAt = document.createElement("p");
    const address = document.createElement("p");
    const phoneNumber = document.createElement("p");
    const gender = document.createElement("p");
    const department = document.createElement("p");
    const userId = document.createElement("p");
    const editButton = document.createElement("button");
    const deleteButton = document.createElement("button");
    const formButtonDiv = document.createElement("div");

    formButtonDiv.classList.add("form-button-conntainer");

    editButton.setAttribute(
      "onClick",
      `editFormHandler(${JSON.stringify(form._id)})`
    );
    deleteButton.setAttribute(
      "onClick",
      `deleteFormHandler${JSON.stringify(form._id)})`
    );

    formDiv.appendChild(username);
    formDiv.appendChild(email);
    formDiv.appendChild(userId);
    formDiv.appendChild(address);
    formDiv.appendChild(phoneNumber);
    formDiv.appendChild(gender);
    formDiv.appendChild(department);
    formDiv.appendChild(createdAt);
    formDiv.appendChild(formButtonDiv);
    formButtonDiv.appendChild(editButton);
    formButtonDiv.appendChild(deleteButton);

    username.textContent = `Username: ${form.username}`;
    email.textContent = `Email: ${form.email}`;
    address.textContent = `Address: ${form.address}`;
    phoneNumber.textContent = `Phone Number: ${form.phoneNumber}`;
    gender.textContent = `Gender: ${form.gender}`;
    department.textContent = `Department: ${form.department}`;
    createdAt.textContent = `Created At: ${form.createdAt}`;
    userId.textContent = `User Id: ${form.userId}`;
    editButton.textContent = "Edit";
    deleteButton.textContent = "Delete";

    allFormContainer.appendChild(formDiv);
  });
}

async function editFormHandler(id) {
  try {
    console.log(id);

    let response = await fetch(`http://localhost:4000/get-form-data/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    response = await response.json();

    if (!response.success) {
      throw new Error("Error: Failed to fetch data");
    }

    body.classList.toggle("stop-scrolling");
    formContainer.classList.toggle("visually-hidden");

    appendEditForData(response.data);

    console.log(response.data);
  } catch (error) {
    console.log(error.message);
  }
}

function appendEditForData(data) {
  const userImputs = document.querySelectorAll(".user-input");
  const selectedOptions = document.querySelectorAll("select");

  const form = document.querySelector("form");

  form.setAttribute("data-id", data._id);

  console.log(form.getAttribute("data-id"));

  userImputs.forEach((input) => {
    input.value = data[input.id];
  });
}

async function handleFormEdit(event) {
  event.preventDefault();

  const userImputs = document.querySelectorAll(".user-input");
  const selectedOptions = document.querySelectorAll("select");

  const formId = form.getAttribute("data-id");

  console.log(formId);

  event.preventDefault();

  userImputs.forEach((input) => {
    formValueObject[input.id] = input.value;
  });
  selectedOptions.forEach((option) => {
    formValueObject[option.id] = option.value;
  });

  console.log(formId);

  const response = await postData(
    "http://localhost:4000/edit-form-submission" + formId,
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
}
