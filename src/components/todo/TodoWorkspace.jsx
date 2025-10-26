import { useEffect, useMemo, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { useAuth } from '../../context/AuthContext.jsx';

const TodoWorkspace = () => {
  const { user, updateLists, limits } = useAuth();
  const lists = user?.lists ?? [];
  const [selectedListId, setSelectedListId] = useState(lists[0]?.id ?? null);
  const [newListName, setNewListName] = useState('');
  const [newItemText, setNewItemText] = useState('');
  const [statusMessage, setStatusMessage] = useState(null);

  useEffect(() => {
    if (!lists.some((list) => list.id === selectedListId)) {
      setSelectedListId(lists[0]?.id ?? null);
    }
  }, [lists, selectedListId]);

  const selectedList = useMemo(
    () => lists.find((list) => list.id === selectedListId) ?? null,
    [lists, selectedListId]
  );

  const showMessage = (message) => {
    setStatusMessage(message);
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleCreateList = (event) => {
    event.preventDefault();
    if (!newListName.trim()) {
      showMessage('Please enter a name for the list.');
      return;
    }
    if (lists.length >= limits.lists) {
      showMessage('You have reached the list limit for your plan.');
      return;
    }
    const newList = {
      id: uuid(),
      name: newListName.trim(),
      items: [],
    };
    updateLists([...lists, newList]);
    setSelectedListId(newList.id);
    setNewListName('');
    showMessage(`Created list “${newList.name}”.`);
  };

  const handleDeleteList = (listId) => {
    if (!window.confirm('Delete this list? This cannot be undone.')) return;
    const updated = lists.filter((list) => list.id !== listId);
    updateLists(updated);
    showMessage('List deleted.');
  };

  const handleRenameList = (listId) => {
    const list = lists.find((item) => item.id === listId);
    if (!list) return;
    const nextName = window.prompt('New list name', list.name);
    if (!nextName) return;
    const updated = lists.map((item) =>
      item.id === listId
        ? {
            ...item,
            name: nextName.trim() || item.name,
          }
        : item
    );
    updateLists(updated);
    showMessage('List renamed.');
  };

  const handleAddItem = (event) => {
    event.preventDefault();
    if (!selectedList) {
      showMessage('Select a list first.');
      return;
    }
    if (!newItemText.trim()) {
      showMessage('Please enter a todo item.');
      return;
    }
    if (selectedList.items.length >= limits.items) {
      showMessage('You have reached the item limit for this list.');
      return;
    }
    const nextItem = {
      id: uuid(),
      text: newItemText.trim(),
      completed: false,
    };
    const updated = lists.map((list) =>
      list.id === selectedList.id
        ? {
            ...list,
            items: [...list.items, nextItem],
          }
        : list
    );
    updateLists(updated);
    setNewItemText('');
  };

  const toggleItem = (listId, itemId) => {
    const updated = lists.map((list) =>
      list.id === listId
        ? {
            ...list,
            items: list.items.map((item) =>
              item.id === itemId ? { ...item, completed: !item.completed } : item
            ),
          }
        : list
    );
    updateLists(updated);
  };

  const renameItem = (listId, itemId) => {
    const list = lists.find((entry) => entry.id === listId);
    const item = list?.items.find((entry) => entry.id === itemId);
    if (!item) return;
    const nextText = window.prompt('Update todo item', item.text);
    if (!nextText) return;
    const updated = lists.map((listEntry) =>
      listEntry.id === listId
        ? {
            ...listEntry,
            items: listEntry.items.map((todo) =>
              todo.id === itemId
                ? {
                    ...todo,
                    text: nextText.trim() || todo.text,
                  }
                : todo
            ),
          }
        : listEntry
    );
    updateLists(updated);
    showMessage('Todo item updated.');
  };

  const deleteItem = (listId, itemId) => {
    const updated = lists.map((list) =>
      list.id === listId
        ? {
            ...list,
            items: list.items.filter((item) => item.id !== itemId),
          }
        : list
    );
    updateLists(updated);
  };

  return (
    <div className="todo-workspace">
      <section className="lists-panel">
        <header>
          <h3>Your lists</h3>
          <p className="limits-note">
            {lists.length} / {limits.lists} lists
          </p>
        </header>
        <form onSubmit={handleCreateList} className="inline-form">
          <input
            type="text"
            placeholder="New list name"
            value={newListName}
            onChange={(event) => setNewListName(event.target.value)}
          />
          <button type="submit" className="secondary">
            Add list
          </button>
        </form>
        <ul className="lists">
          {lists.map((list) => (
            <li key={list.id} className={list.id === selectedListId ? 'active' : ''}>
              <button type="button" onClick={() => setSelectedListId(list.id)} className="list-button">
                <span>{list.name}</span>
                <span className="item-count">{list.items.length} items</span>
              </button>
              <div className="list-actions">
                <button type="button" onClick={() => handleRenameList(list.id)}>
                  Rename
                </button>
                <button type="button" onClick={() => handleDeleteList(list.id)} className="danger">
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="items-panel">
        {selectedList ? (
          <div className="items-wrapper">
            <header>
              <h3>{selectedList.name}</h3>
              <p className="limits-note">
                {selectedList.items.length} / {limits.items} items
              </p>
            </header>
            <form onSubmit={handleAddItem} className="inline-form">
              <input
                type="text"
                placeholder="Add a todo"
                value={newItemText}
                onChange={(event) => setNewItemText(event.target.value)}
              />
              <button type="submit" className="primary">
                Add item
              </button>
            </form>
            <ul className="todo-items">
              {selectedList.items.map((item) => (
                <li key={item.id} className={item.completed ? 'completed' : ''}>
                  <label>
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => toggleItem(selectedList.id, item.id)}
                    />
                    <span>{item.text}</span>
                  </label>
                  <div className="item-actions">
                    <button type="button" onClick={() => renameItem(selectedList.id, item.id)}>
                      Edit
                    </button>
                    <button
                      type="button"
                      className="danger"
                      onClick={() => deleteItem(selectedList.id, item.id)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="empty-state">
            <h3>No list selected</h3>
            <p>Create or choose a list to start adding todos.</p>
          </div>
        )}
      </section>

      {statusMessage && (
        <div className="toast" role="status">
          {statusMessage}
        </div>
      )}
    </div>
  );
};

export default TodoWorkspace;
