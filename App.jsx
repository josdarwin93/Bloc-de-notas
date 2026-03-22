import React, { useState } from 'react';
import { Plus, ArrowLeft, Trash2, Edit3, Save, FileText } from 'lucide-react';

export default function App() {
  // Estado en memoria
  const [notes, setNotes] = useState([
    { id: 1, title: 'Nota de ejemplo', content: 'Aquí puedes escribir lo que necesites recordar.', date: new Date().toLocaleDateString() }
  ]);
  const [view, setView] = useState('list'); // 'list', 'edit', 'detail'
  const [activeNote, setActiveNote] = useState(null);
  
  // Estados para el formulario
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  // Funciones de navegación
  const goToList = () => {
    setView('list');
    setActiveNote(null);
  };

  const goToDetail = (note) => {
    setActiveNote(note);
    setView('detail');
  };

  const goToEdit = (note = null) => {
    if (note) {
      setActiveNote(note);
      setEditTitle(note.title);
      setEditContent(note.content);
    } else {
      setActiveNote(null);
      setEditTitle('');
      setEditContent('');
    }
    setView('edit');
  };

  // Acciones CRUD
  const saveNote = () => {
    if (!editTitle.trim() && !editContent.trim()) return;

    if (activeNote) {
      // Actualizar nota existente
      setNotes(notes.map(n => 
        n.id === activeNote.id 
          ? { ...n, title: editTitle || 'Sin título', content: editContent, date: new Date().toLocaleDateString() }
          : n
      ));
    } else {
      // Crear nueva nota
      const newNote = {
        id: Date.now(),
        title: editTitle || 'Sin título',
        content: editContent,
        date: new Date().toLocaleDateString()
      };
      setNotes([newNote, ...notes]);
    }
    goToList();
  };

  const deleteNote = (id) => {
    setNotes(notes.filter(n => n.id !== id));
    goToList();
  };

  // Vistas
  const renderList = () => (
    <div className="flex flex-col h-full bg-gray-50">
      <header className="bg-blue-600 text-white p-4 shadow-md sticky top-0 z-10">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <FileText size={24} /> Mis Notas
        </h1>
      </header>
      
      <main className="flex-1 overflow-y-auto p-4 space-y-3 pb-24">
        {notes.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">No tienes notas. ¡Crea una!</p>
        ) : (
          notes.map(note => (
            <div 
              key={note.id} 
              onClick={() => goToDetail(note)}
              className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 active:bg-gray-50 cursor-pointer"
            >
              <h2 className="font-semibold text-gray-800 truncate">{note.title}</h2>
              <p className="text-sm text-gray-500 line-clamp-2 mt-1">{note.content}</p>
              <p className="text-xs text-gray-400 mt-2">{note.date}</p>
            </div>
          ))
        )}
      </main>

      <button 
        onClick={() => goToEdit()}
        className="absolute bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 active:scale-95 transition-transform"
      >
        <Plus size={24} />
      </button>
    </div>
  );

  const renderDetail = () => (
    <div className="flex flex-col h-full bg-white">
      <header className="bg-white text-gray-800 p-4 shadow-sm flex justify-between items-center sticky top-0 border-b z-10">
        <button onClick={goToList} className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft size={24} />
        </button>
        <div className="flex gap-2">
          <button onClick={() => goToEdit(activeNote)} className="p-2 hover:bg-gray-100 rounded-full text-blue-600">
            <Edit3 size={20} />
          </button>
          <button onClick={() => deleteNote(activeNote.id)} className="p-2 hover:bg-red-50 rounded-full text-red-500">
            <Trash2 size={20} />
          </button>
        </div>
      </header>
      
      <main className="flex-1 overflow-y-auto p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{activeNote.title}</h1>
        <p className="text-sm text-gray-400 mb-6">{activeNote.date}</p>
        <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
          {activeNote.content}
        </div>
      </main>
    </div>
  );

  const renderEdit = () => (
    <div className="flex flex-col h-full bg-white">
      <header className="bg-white text-gray-800 p-4 shadow-sm flex justify-between items-center sticky top-0 border-b z-10">
        <button onClick={view === 'edit' && activeNote ? () => goToDetail(activeNote) : goToList} className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft size={24} />
        </button>
        <button onClick={saveNote} className="p-2 hover:bg-blue-50 rounded-full text-blue-600 flex items-center gap-1 font-medium">
          <Save size={20} /> Guardar
        </button>
      </header>
      
      <main className="flex-1 flex flex-col p-4">
        <input 
          type="text" 
          placeholder="Título" 
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          className="text-2xl font-bold text-gray-900 mb-4 focus:outline-none placeholder-gray-300 w-full"
        />
        <textarea 
          placeholder="Escribe tu nota aquí..." 
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          className="flex-1 resize-none focus:outline-none text-gray-700 w-full text-lg leading-relaxed placeholder-gray-300"
        />
      </main>
    </div>
  );

  return (
    <div className="w-full h-screen sm:h-[800px] sm:max-w-md sm:mx-auto sm:my-8 sm:border sm:rounded-3xl overflow-hidden shadow-2xl relative bg-black">
      {view === 'list' && renderList()}
      {view === 'detail' && renderDetail()}
      {view === 'edit' && renderEdit()}
    </div>
  );
}

