import { JOURNAL_BASE_URL, CHECKLIST_BASE_URL, USER_BASE_URL} from "@/lib/api";

const getToken = () => localStorage.getItem("token");

export async function fetchUserEntries() {
    // console.log(JOURNAL_BASE_URL)
  const response = await fetch(`${JOURNAL_BASE_URL}/show-entries`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  if (!response.ok) throw new Error("Failed to fetch journal entries");
  return response.json();
}

export async function createJournalEntry(entry) {
  const response = await fetch(`${JOURNAL_BASE_URL}/create-entry`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(entry),
  });
  if (!response.ok) throw new Error("Failed to create entry");
  return response.json();
}

export async function updateJournalEntry(id, updatedEntry) {
  const response = await fetch(`${JOURNAL_BASE_URL}/id/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(updatedEntry),
  });
  if (!response.ok) throw new Error("Failed to update entry");
  return response.json();
}

export async function deleteJournalEntry(id) {
  const response = await fetch(`${JOURNAL_BASE_URL}/id/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  if (!response.ok) throw new Error("Failed to delete entry");
}


export async function createCheckListItem(item) {
  const response = await fetch(`${CHECKLIST_BASE_URL}/create-checkList`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(item),
  });
  if (!response.ok) throw new Error("Failed to create checklist item");
  return response.json();
}


export async function deleteCheckListItem(id) {
  const response = await fetch(`${CHECKLIST_BASE_URL}/id/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  if (!response.ok) throw new Error("Failed to delete entry");
}

export async function triggerSentimentAnalysisEmail() {
  const response = await fetch(`${USER_BASE_URL}/send-email`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to send analysis email: ${errorText}`);
  }

  return response;
}
