const allFormContainer = document.querySelector(".all-forms-container");
const body = document.querySelector("body");
const formContainer = document.querySelector(".edit-form-container");
const form = document.querySelector("form");
const modelContainer = document.querySelector(".modal-container");
const searchInput = document.querySelector("#search");

let allForms = [];
let allFormsCached = [];

let currentSelectedFormId = null;

const colorsArray = [
  "#70cc54b9",
  "#f0e890b9",
  "#5482ccb9",
  "#c0cc54b9",
  "#de62b9b9",
  "#6b83cfb9",
  "#50b58eb9",
];

let colorIndex = 0;

(async () => {
  handleInitialLoad();
})();

async function handleSearch(event) {
  event.preventDefault();
  console.log(searchInput.value);

  const filteredForms = allFormsCached.filter((form) => {
    const formValues = Object.values(form);

    return formValues.some((value) => {
      if (typeof value === "string") {
        return value.toLowerCase().includes(searchInput.value.toLowerCase());
      }
    });
  });

  appendForData(filteredForms);
}

async function handleInitialLoad() {
  try {
    console.log("Called");
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
    allForms = response.data;
    allFormsCached = response.data;

    appendForData(allForms);
  } catch (error) {
    console.log(error);
  }
}

function appendForData(data) {
  console.log("Append called");
  allFormContainer.innerHTML = "";

  data.forEach((form) => {
    const formDiv = document.createElement("div");
    const options = { year: "numeric", month: "long", day: "numeric" };
    const createdAtForm = form.createdAt
      ? new Date(form.createdAt)
      : new Date();
    const creationDate = createdAtForm.toLocaleDateString(undefined, options);

    formDiv.classList.add("form-data");
    if (colorIndex === colorsArray.length) {
      colorIndex = 0;
    }

    formDiv.style.backgroundColor = colorsArray[colorIndex++];

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
      `deleteFormHandler(${JSON.stringify(form._id)})`
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

    username.innerHTML = `<span>Username</span>: ${form.username}`;
    email.innerHTML = `<span>Email</span>: ${form.email}`;
    address.innerHTML = `<span>Address</span>: ${form.address}`;
    phoneNumber.innerHTML = `<span>Phone Number</span>: ${form.phoneNumber}`;
    gender.innerHTML = `<span>Gendee</span>: ${form.gender}`;
    department.innerHTML = `<span>Department</span>: ${form.department}`;
    createdAt.innerHTML = `<span>Created At</span>: ${creationDate}`;
    userId.innerHTML = `<span>User Id</span>: ${form.userId}`;
    editButton.textContent = "Edit";
    deleteButton.textContent = "Delete";

    allFormContainer.appendChild(formDiv);
  });
}

function deleteFormHandler(id) {
  try {
    modelContainer.classList.toggle("visually-hidden");

    currentSelectedFormId = id;
  } catch (error) {
    console.log(error.message);
  }
}

async function handleConfirmDeletion() {
  try {
    response = await postData(
      "http://localhost:4000/delete-form/" + currentSelectedFormId,
      {},
      "DELETE"
    );

    response = await response.json();

    console.log(response);

    if (!response.success) {
      throw new Error("Error: Failed to delete data");
    }

    modelContainer.classList.toggle("visually-hidden");

    window.location.reload();
  } catch (error) {
    console.log(error.message);
  }
}

async function editFormHandler(id) {
  try {
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

    allFormContainer.classList.toggle("visually-hidden");
    formContainer.classList.toggle("visually-hidden");

    appendEditForData(response.data);

    console.log(response.data);
  } catch (error) {
    console.log(error.message);
  }
}

function appendEditForData(data) {
  const userImputs = document.querySelectorAll(".user-input");

  form.setAttribute("data-id", data._id);

  console.log(form.getAttribute("data-id"));

  userImputs.forEach((input) => {
    input.value = data[input.id];
  });
}

async function handleFormEdit(event) {
  event.preventDefault();
  const formValueObject = {};

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

  console.log({ formValueObject });

  let response = await postData(
    "http://localhost:4000/edit-form/" + formId,
    formValueObject,
    "PUT"
  );

  response = await response.json();

  console.log(response);

  if (response) {
    console.log(response);
    console.log("Succesfully submitted");
    allFormContainer.classList.toggle("visually-hidden");
    formContainer.classList.toggle("visually-hidden");
    handleInitialLoad();
    window.location.reload();
  }
}

async function postData(url = "", data = {}, method = "POST") {
  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return response;
}
