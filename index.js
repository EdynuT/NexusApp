import React, { useState, useEffect, useCallback, useRef } from 'react';
// Firebase v9 compat imports
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage'; 

// Importações de Lucide Icons - Renomeadas para evitar conflitos e organizadas
import { 
    Home as HomeIconLucide, Users as UsersIcon, Map as MapIconLucide, BookOpen as BookOpenIcon, 
    Dices as DicesIconLucide, Settings as SettingsIcon, PlusCircle as PlusCircleIcon, Trash2 as Trash2Icon, 
    Edit3 as Edit3IconLucide, LogOut as LogOutIconLucide, ShieldCheck as ShieldCheckIconLucide, 
    ScrollText as ScrollTextIconLucide, Landmark as LandmarkIcon, TreePalm as TreePalmIcon, 
    MountainSnow as MountainSnowIcon, Compass as CompassIcon, Sun as SunIcon, Moon as MoonIcon, 
    CloudDrizzle as CloudDrizzleIcon, ChevronsUpDown as ChevronsUpDownIconLucide, Check as CheckIcon, 
    X as XIconLucide, AlertTriangle as AlertTriangleIcon, Info as InfoIcon, Eye as EyeIcon, 
    EyeOff as EyeOffIcon, MessageSquare as MessageSquareIcon, CalendarDays as CalendarDaysIcon, 
    ImagePlus as ImagePlusIcon, UploadCloud as UploadCloudIcon, Search as SearchIcon, 
    Wand2 as Wand2Icon, Skull as SkullIcon, Ghost as GhostIcon, Castle as CastleIcon, Gem as GemIcon, 
    Coins as CoinsIcon, Shield as ShieldIconLucide, Sword as SwordIcon, Heart as HeartIcon, 
    Star as StarIcon, Zap as ZapIcon, Wind as WindIcon, Leaf as LeafIcon, Droplets as DropletsIcon, 
    Flame as FlameIcon, FileText as FileTextIcon, BookMarked as BookMarkedIcon, 
    MapPin as MapPinIconLucide, ExternalLink as ExternalLinkIconLucide, Image as ImageIconLucide, 
    Edit as EditIconLucide, Swords as SwordsIcon, UserPlus as UserPlusIcon, 
    ArrowRightCircle as ArrowRightCircleIcon, ArrowLeftCircle as ArrowLeftCircleIcon, 
    ListOrdered as ListOrderedIcon, Save as SaveIconLucide, BookLock as BookLockIconLucide, 
    HeartPulse as HeartPulseIconLucide, ShieldAlert as ShieldAlertIconLucide, Sparkles as SparklesIconLucide, 
    MinusCircle as MinusCircleIcon, PlusCircle as PlusCircleSmallIcon, Angry as AngryIcon, 
    Bug as BugIconLucide, UserCircle2 as UserCircle2IconLucide, Grid as GridIconLucide, Eraser as EraserIconLucide,
    FileArchive as FileArchiveIcon 
} from 'lucide-react';

// Mapeamento de nomes de string para componentes de ícones
const iconMap = {
  Home: HomeIconLucide, Users: UsersIcon, MapIcon: MapIconLucide, BookOpen: BookOpenIcon,
  Dices: DicesIconLucide, Settings: SettingsIcon, PlusCircle: PlusCircleIcon, Trash2: Trash2Icon,
  Edit3: Edit3IconLucide, LogOut: LogOutIconLucide, ShieldCheck: ShieldCheckIconLucide,
  ScrollText: ScrollTextIconLucide, Landmark: LandmarkIcon, TreePalm: TreePalmIcon,
  MountainSnow: MountainSnowIcon, Compass: CompassIcon, Sun: SunIcon, Moon: MoonIcon,
  CloudDrizzle: CloudDrizzleIcon, ChevronsUpDown: ChevronsUpDownIconLucide, Check: CheckIcon,
  X: XIconLucide, AlertTriangle: AlertTriangleIcon, Info: InfoIcon, Eye: EyeIcon, EyeOff: EyeOffIcon,
  MessageSquare: MessageSquareIcon, CalendarDays: CalendarDaysIcon, ImagePlus: ImagePlusIcon,
  UploadCloud: UploadCloudIcon, Search: SearchIcon, Wand2: Wand2Icon, Skull: SkullIcon,
  Ghost: GhostIcon, Castle: CastleIcon, Gem: GemIcon, Coins: CoinsIcon, Shield: ShieldIconLucide,
  Sword: SwordIcon, Heart: HeartIcon, Star: StarIcon, Zap: ZapIcon, Wind: WindIcon, Leaf: LeafIcon,
  Droplets: DropletsIcon, Flame: FlameIcon, FileText: FileTextIcon, BookMarked: BookMarkedIcon,
  MapPin: MapPinIconLucide, ExternalLink: ExternalLinkIconLucide, ImageIcon: ImageIconLucide,
  Edit: EditIconLucide, Swords: SwordsIcon, UserPlus: UserPlusIcon,
  ArrowRightCircle: ArrowRightCircleIcon, ArrowLeftCircle: ArrowLeftCircleIcon,
  ListOrdered: ListOrderedIcon, Save: SaveIconLucide, BookLock: BookLockIconLucide,
  HeartPulse: HeartPulseIconLucide, ShieldAlert: ShieldAlertIconLucide, Sparkles: SparklesIconLucide,
  MinusCircle: MinusCircleIcon, PlusCircleSmall: PlusCircleSmallIcon, Angry: AngryIcon,
  Bug: BugIconLucide, UserCircle2: UserCircle2IconLucide, Grid: GridIconLucide, Eraser: EraserIconLucide,
  FileArchive: FileArchiveIcon,
};


// Configuração do Firebase (será fornecida pelo ambiente Canvas)
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {
    apiKey: "YOUR_API_KEY", 
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET", 
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// ID da Aplicação (será fornecido pelo ambiente Canvas)
const appId = typeof __app_id !== 'undefined' ? __app_id : 'nexus-rpg-default';

// Inicializa Firebase (compat mode)
let firebaseAppInstance;
if (!firebase.apps.length) {
    firebaseAppInstance = firebase.initializeApp(firebaseConfig);
} else {
    firebaseAppInstance = firebase.app(); 
}
const authGlobal = firebaseAppInstance.auth();
const dbGlobal = firebaseAppInstance.firestore();
let storageGlobal = null; 
try {
    if (firebaseAppInstance.storage) { // Verifica se o método storage existe
        storageGlobal = firebaseAppInstance.storage(); 
    } else {
        console.warn("Firebase Storage service não está disponível nesta instância do Firebase.");
    }
} catch (e) {
    console.warn("Firebase Storage não pôde ser inicializado. Uploads de arquivo podem não funcionar.", e);
}
const serverTimestampGlobal = firebase.firestore.FieldValue.serverTimestamp;


// Componente de Ícone Genérico
const Icon = ({ name, ...props }) => {
    const IconComponent = typeof name === 'string' ? iconMap[name] : name;
    if (!IconComponent) {
        return <ImageIconLucide {...props} />;
    }
    return <IconComponent {...props} />;
};

// Componente Modal Genérico
const Modal = ({ isOpen, onClose, title, children, size = "md" }) => {
    if (!isOpen) return null;
    const sizeClasses = { sm: 'sm:max-w-sm', md: 'sm:max-w-md', lg: 'sm:max-w-lg', xl: 'sm:max-w-xl', '2xl': 'sm:max-w-2xl', full: 'sm:max-w-full' };
    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className={`bg-gray-800 rounded-lg shadow-xl w-full ${sizeClasses[size]} p-6 transform transition-all`}>
                <div className="flex justify-between items-center mb-4"> <h3 className="text-xl font-semibold text-sky-400">{title}</h3> <button onClick={onClose} className="text-gray-400 hover:text-sky-400 transition-colors p-1 rounded-full" aria-label="Fechar modal"> <Icon name="X" size={24} /> </button> </div>
                <div className="text-gray-300 max-h-[80vh] overflow-y-auto custom-scrollbar">{children}</div>
            </div>
        </div>
    );
};

// Componente de Notificação (Toast)
const Toast = ({ message, type, onClose }) => {
    if (!message) return null;
    const bgColor = type === 'error' ? 'bg-red-600' : type === 'success' ? 'bg-green-600' : 'bg-sky-600';
    return (
        <div className={`fixed bottom-5 right-5 ${bgColor} text-white p-4 rounded-lg shadow-md flex items-center z-[100]`}>
            {type === 'error' && <Icon name="AlertTriangle" size={20} className="mr-2" />} {type === 'success' && <Icon name="Check" size={20} className="mr-2" />} {type === 'info' && <Icon name="Info" size={20} className="mr-2" />}
            <span>{message}</span> <button onClick={onClose} className="ml-4 text-white hover:text-gray-200"> <Icon name="X" size={18} /> </button>
        </div>
    );
};

// Função de Upload de Arquivo para Firebase Storage
const uploadFileToStorage = async (file, path, addToast) => {
    if (!file) return null;
    if (!storageGlobal) {
        addToast("Serviço de Storage não está disponível. Upload cancelado.", "error");
        console.error("Firebase Storage não inicializado.");
        return null;
    }
    const storageRef = storageGlobal.ref();
    const fileRef = storageRef.child(`${path}/${Date.now()}_${file.name}`);
    try {
        addToast(`Fazendo upload de ${file.name}...`, 'info');
        const snapshot = await fileRef.put(file);
        const downloadURL = await snapshot.ref.getDownloadURL();
        addToast("Upload completo!", "success");
        return downloadURL;
    } catch (error) {
        console.error("Erro no upload do arquivo:", error);
        addToast(`Falha no upload: ${error.message}`, "error");
        return null;
    }
};


// Componente Rolador de Dados
const DiceRoller = ({ addToast }) => {
    const [diceInput, setDiceInput] = useState('1d20'); const [rollResult, setRollResult] = useState(null); const [rollHistory, setRollHistory] = useState([]);
    const parseDiceInput = (input) => { const match = input.toLowerCase().match(/(\d+)?d(\d+)([+-]\d+)?/); if (!match) return null; const numDice = match[1] ? parseInt(match[1], 10) : 1; const numSides = parseInt(match[2], 10); const modifier = match[3] ? parseInt(match[3], 10) : 0; if (isNaN(numDice) || isNaN(numSides) || numDice <= 0 || numSides <= 0 || numDice > 100 || numSides > 1000) return null; return { numDice, numSides, modifier }; };
    const rollDice = () => { const parsed = parseDiceInput(diceInput); if (!parsed) { addToast('Formato de dado inválido. Use NdS+M (ex: 2d6+3 ou 1d20).', 'error'); setRollResult(null); return; } const { numDice, numSides, modifier } = parsed; let total = 0; const rolls = []; for (let i = 0; i < numDice; i++) { const roll = Math.floor(Math.random() * numSides) + 1; rolls.push(roll); total += roll; } total += modifier; const resultString = `${numDice}d${numSides}${modifier >= 0 ? '+' : ''}${modifier} = [${rolls.join(', ')}]${modifier !== 0 ? (modifier > 0 ? ` + ${modifier}` : ` - ${Math.abs(modifier)}`) : ''} = ${total}`; setRollResult({ total, rolls, modifier, input: diceInput, resultString }); setRollHistory(prev => [{ input: diceInput, resultString, total, timestamp: new Date() }, ...prev.slice(0, 9)]); addToast(`Rolagem: ${resultString}`, 'info'); };
    return ( <div className="bg-gray-800 p-6 rounded-lg shadow-xl"> <h2 className="text-2xl font-semibold text-sky-400 mb-6 flex items-center"><Icon name="Dices" size={28} className="mr-3" />Rolador de Dados</h2> <div className="flex flex-col sm:flex-row gap-4 mb-6"> <input type="text" value={diceInput} onChange={(e) => setDiceInput(e.target.value)} placeholder="Ex: 2d6+3" className="flex-grow p-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none" /> <button onClick={rollDice} className="bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 px-6 rounded-md transition-colors duration-150 flex items-center justify-center"> <Icon name="Dices" size={20} className="mr-2" /> Rolar </button> </div> {rollResult && ( <div className="bg-gray-700 p-4 rounded-md mb-6"> <p className="text-lg text-sky-300">Resultado da Rolagem:</p> <p className="text-2xl font-bold text-white">{rollResult.total}</p> <p className="text-sm text-gray-400">{rollResult.resultString}</p> </div> )} {rollHistory.length > 0 && ( <div> <h3 className="text-xl font-semibold text-sky-400 mb-3">Histórico de Rolagens (últimas 10):</h3> <ul className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar"> {rollHistory.map((item, index) => ( <li key={index} className="bg-gray-700 p-3 rounded-md text-sm"> <span className="text-gray-400">{new Date(item.timestamp).toLocaleTimeString()}: </span> <span className="text-sky-300">{item.input}</span> <span className="text-white"> = {item.total} </span> <span className="text-xs text-gray-500 block sm:inline">({item.resultString.split('=')[1].trim()})</span> </li> ))} </ul> </div> )} </div> );
};

// Componente Ficha de Personagem
const CharacterSheet = ({ character, onDeleteCharacter, onOpenHistoryModal, addToast, db, userId, appId }) => {
    const [isEditing, setIsEditing] = useState(false); 
    const [editedName, setEditedName] = useState(character.name); 
    const [editedClass, setEditedClass] = useState(character.class); 
    const [editedRace, setEditedRace] = useState(character.race); 
    const [editedLevel, setEditedLevel] = useState(character.level); 
    const [editedHp, setEditedHp] = useState(character.hp); 
    const [editedMaxHp, setEditedMaxHp] = useState(character.maxHp);
    const [editedImageUrl, setEditedImageUrl] = useState(character.imageUrl || '');
    const [editedHistory, setEditedHistory] = useState(character.history || ''); 
    const [imageFile, setImageFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setImageFile(e.target.files[0]);
            setEditedImageUrl(''); 
        }
    };

    const handleSave = async () => { 
        if (!db || !userId) { addToast("Erro: Banco de dados ou usuário não disponível.", "error"); return; } 
        
        let finalImageUrl = editedImageUrl.trim();
        if (imageFile && storageGlobal) { 
            setIsUploading(true);
            const uploadedUrl = await uploadFileToStorage(imageFile, `characterImages/${userId}`, addToast);
            setIsUploading(false);
            if (uploadedUrl) {
                finalImageUrl = uploadedUrl;
            } else {
                addToast("Falha no upload da imagem. Verifique o console para detalhes.", "error");
            }
        } else if (imageFile && !storageGlobal) {
            addToast("Serviço de Storage não disponível. Imagem não será enviada.", "warning");
        }
        
        const updatedCharData = { 
            name: editedName, 
            class: editedClass, 
            race: editedRace, 
            level: parseInt(editedLevel) || 1, 
            hp: parseInt(editedHp) || 0, 
            maxHp: parseInt(editedMaxHp) || 1, 
            imageUrl: finalImageUrl || '',
            history: editedHistory.trim() || '' 
        }; 
        try { 
            const charDocRef = db.collection(`artifacts/${appId}/users/${userId}/characters`).doc(character.id); 
            await charDocRef.update(updatedCharData); 
            setIsEditing(false); 
            setImageFile(null); 
            addToast("Ficha atualizada com sucesso!", "success"); 
        } catch (error) { 
            console.error("Erro ao atualizar ficha:", error); 
            addToast("Erro ao atualizar ficha. " + error.message, "error"); 
        } 
    };

    if (isEditing) { 
        return ( 
            <div className="bg-gray-700 p-4 rounded-lg shadow-md space-y-3"> 
                <input type="text" value={editedName} onChange={e => setEditedName(e.target.value)} placeholder="Nome" className="w-full p-2 bg-gray-600 rounded text-white" /> 
                <input type="text" value={editedRace} onChange={e => setEditedRace(e.target.value)} placeholder="Raça" className="w-full p-2 bg-gray-600 rounded text-white" /> 
                <input type="text" value={editedClass} onChange={e => setEditedClass(e.target.value)} placeholder="Classe" className="w-full p-2 bg-gray-600 rounded text-white" /> 
                <div className="flex gap-2"> 
                    <input type="number" value={editedLevel} onChange={e => setEditedLevel(e.target.value)} placeholder="Nível" className="w-1/3 p-2 bg-gray-600 rounded text-white" /> 
                    <input type="number" value={editedHp} onChange={e => setEditedHp(e.target.value)} placeholder="PV Atual" className="w-1/3 p-2 bg-gray-600 rounded text-white" /> 
                    <input type="number" value={editedMaxHp} onChange={e => setEditedMaxHp(e.target.value)} placeholder="PV Máx" className="w-1/3 p-2 bg-gray-600 rounded text-white" /> 
                </div> 
                <input type="url" value={editedImageUrl} onChange={e => { setEditedImageUrl(e.target.value); setImageFile(null); }} placeholder="URL da Imagem do Personagem" className="w-full p-2 bg-gray-600 rounded text-white" disabled={!!imageFile}/>
                {storageGlobal && <>
                    <div className="text-sm text-gray-400 text-center my-1">OU</div>
                    <label className="block">
                        <span className="text-gray-300 text-sm">Upload de Imagem:</span>
                        <input type="file" accept="image/*" onChange={handleFileChange} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100 mt-1"/>
                    </label>
                    {imageFile && <p className="text-xs text-sky-400">Arquivo selecionado: {imageFile.name}</p>}
                </>}
                <textarea placeholder="História do Personagem..." value={editedHistory} onChange={e => setEditedHistory(e.target.value)} rows="4" className="w-full p-2 bg-gray-600 rounded text-white custom-scrollbar"></textarea>
                <div className="flex justify-end gap-2"> 
                    <button onClick={() => setIsEditing(false)} className="px-3 py-1 bg-gray-500 hover:bg-gray-400 text-white rounded">Cancelar</button> 
                    <button onClick={handleSave} disabled={isUploading} className="px-3 py-1 bg-sky-600 hover:bg-sky-700 text-white rounded disabled:opacity-50">
                        {isUploading ? <Icon name="UploadCloud" className="animate-ping" /> : "Salvar"}
                    </button> 
                </div> 
            </div> 
        ); 
    }
    return ( 
        <div className="bg-gray-700 p-4 rounded-lg shadow-md hover:shadow-sky-500/30 transition-shadow flex flex-col">
            {character.imageUrl ? (
                <img 
                    src={character.imageUrl} 
                    alt={`Imagem de ${character.name}`} 
                    className="w-full h-40 object-cover rounded-md mb-3" 
                    onError={(e) => { e.target.style.display = 'none'; const placeholder = e.target.parentElement.querySelector('.placeholder-image'); if(placeholder) placeholder.style.display = 'flex'; }}
                />
            ) : null}
            <div className={`w-full h-40 bg-gray-600 flex items-center justify-center rounded-md mb-3 text-gray-400 placeholder-image ${character.imageUrl ? 'hidden' : 'flex'}`}>
                <Icon name="UserCircle2" size={48} />
            </div>
            <div className="flex justify-between items-start"> 
                <div> 
                    <h3 className="text-xl font-bold text-sky-400">{character.name}</h3> 
                    <p className="text-sm text-gray-300">{character.race} {character.class}, Nível {character.level}</p> 
                </div> 
                <div className="flex gap-2 flex-shrink-0"> 
                    <button onClick={() => setIsEditing(true)} className="p-1 text-gray-400 hover:text-sky-400"><Icon name="Edit3" size={18}/></button> 
                    <button onClick={() => onDeleteCharacter(character)} className="p-1 text-gray-400 hover:text-red-500"><Icon name="Trash2" size={18}/></button> 
                </div> 
            </div> 
            <div className="mt-3"> 
                <p className="text-gray-200">PV: <span className="font-semibold text-green-400">{character.hp}</span> / <span className="text-green-300">{character.maxHp}</span></p> 
            </div>
            {character.history && (
                <button onClick={() => onOpenHistoryModal(character)} className="mt-3 text-xs bg-sky-700 hover:bg-sky-800 text-white py-1 px-2 rounded-md self-start">
                    Ver História
                </button>
            )}
        </div> 
    );
};

// Componente para Seção de Fichas
const FichasScreen = ({ addToast, db, userId, appId }) => {
    const [characters, setCharacters] = useState([]); const [isModalOpen, setIsModalOpen] = useState(false); 
    const [newCharName, setNewCharName] = useState(''); const [newCharClass, setNewCharClass] = useState(''); const [newCharRace, setNewCharRace] = useState(''); 
    const [newCharLevel, setNewCharLevel] = useState(1); const [newCharHp, setNewCharHp] = useState(10); const [newCharMaxHp, setNewCharMaxHp] = useState(10);
    const [newCharImageUrl, setNewCharImageUrl] = useState('');
    const [newCharImageFile, setNewCharImageFile] = useState(null); 
    const [newCharHistory, setNewCharHistory] = useState(''); 
    const [isUploading, setIsUploading] = useState(false);

    const [isLoading, setIsLoading] = useState(true); const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false); const [charToDelete, setCharToDelete] = useState(null);
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false); 
    const [viewingCharHistory, setViewingCharHistory] = useState(null); 

    const charactersCollectionPath = `artifacts/${appId}/users/${userId}/characters`;
    useEffect(() => { if (!db || !userId) { setIsLoading(false); return; } setIsLoading(true); const charactersRef = db.collection(charactersCollectionPath); const unsubscribe = charactersRef.onSnapshot(querySnapshot => { const charsData = []; querySnapshot.forEach(doc => { charsData.push({ id: doc.id, ...doc.data() }); }); charsData.sort((a, b) => a.name.localeCompare(b.name)); setCharacters(charsData); setIsLoading(false); }, error => { console.error("Erro ao carregar fichas: ", error); addToast("Erro ao carregar fichas: " + error.message, "error"); setIsLoading(false); }); return () => unsubscribe(); }, [db, userId, appId, charactersCollectionPath, addToast]);
    
    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setNewCharImageFile(e.target.files[0]);
            setNewCharImageUrl(''); 
        }
    };
    
    const handleAddCharacter = async () => { 
        if (!db || !userId) { addToast("Erro: Banco de dados ou usuário não disponível.", "error"); return; } 
        if (!newCharName.trim() || !newCharClass.trim() || !newCharRace.trim()) { addToast("Nome, classe e raça são obrigatórios.", "error"); return; } 
        
        let finalImageUrl = newCharImageUrl.trim();
        if (newCharImageFile && storageGlobal) {
            setIsUploading(true);
            const uploadedUrl = await uploadFileToStorage(newCharImageFile, `characterImages/${userId}`, addToast);
            setIsUploading(false);
            if (uploadedUrl) {
                finalImageUrl = uploadedUrl;
            } else {
                addToast("Falha no upload da imagem. A ficha será salva sem imagem.", "warning");
            }
        } else if (newCharImageFile && !storageGlobal) {
             addToast("Serviço de Storage não disponível. Imagem não será enviada.", "warning");
        }
        
        const newCharacter = { 
            name: newCharName, class: newCharClass, race: newCharRace, 
            level: parseInt(newCharLevel) || 1, hp: parseInt(newCharHp) || 10, maxHp: parseInt(newCharMaxHp) || 10, 
            imageUrl: finalImageUrl || '', 
            history: newCharHistory.trim() || '', 
            createdAt: serverTimestampGlobal() 
        }; 
        try { 
            await db.collection(charactersCollectionPath).add(newCharacter); 
            addToast("Ficha criada com sucesso!", "success"); 
            setIsModalOpen(false); 
            setNewCharName(''); setNewCharClass(''); setNewCharRace(''); setNewCharLevel(1); setNewCharHp(10); setNewCharMaxHp(10); setNewCharImageUrl(''); setNewCharImageFile(null); setNewCharHistory('');
        } catch (error) { 
            console.error("Erro ao adicionar ficha: ", error); 
            addToast("Erro ao criar ficha: " + error.message, "error"); 
        } 
    };
    const handleDeleteRequest = (character) => { setCharToDelete(character); setShowDeleteConfirmModal(true); };
    const confirmDeleteCharacter = async () => { if (!db || !userId || !charToDelete || !charToDelete.id) { addToast("Erro: Não foi possível deletar a ficha.", "error"); setShowDeleteConfirmModal(false); setCharToDelete(null); return; } try { await db.collection(charactersCollectionPath).doc(charToDelete.id).delete(); addToast(`Ficha de ${charToDelete.name} deletada com sucesso!`, "success"); } catch (error) { console.error("Erro ao deletar ficha:", error); addToast("Erro ao deletar ficha. " + error.message, "error"); } finally { setShowDeleteConfirmModal(false); setCharToDelete(null); } };
    
    const handleOpenHistoryModal = (character) => {
        setViewingCharHistory(character);
        setIsHistoryModalOpen(true);
    };

    return ( <div className="space-y-6"> <div className="flex justify-between items-center"> <h1 className="text-3xl font-bold text-sky-400 flex items-center"><Icon name="Users" size={32} className="mr-3" />Fichas de Personagem</h1> <button onClick={() => setIsModalOpen(true)} className="bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-4 rounded-md flex items-center transition-colors"> <Icon name="PlusCircle" size={20} className="mr-2" /> Criar Nova Ficha </button> </div> {isLoading && <p className="text-gray-400">Carregando fichas...</p>} {!isLoading && characters.length === 0 && <p className="text-gray-400 text-center py-8">Nenhuma ficha encontrada. Crie uma para começar!</p>} {!isLoading && characters.length > 0 && ( <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> {characters.map(char => ( <CharacterSheet key={char.id} character={char} onDeleteCharacter={handleDeleteRequest} onOpenHistoryModal={handleOpenHistoryModal} addToast={addToast} db={db} userId={userId} appId={appId} /> ))} </div> )} 
    <Modal isOpen={isModalOpen} onClose={() => {setIsModalOpen(false); setNewCharImageFile(null); setNewCharImageUrl(''); setNewCharHistory('');}} title="Criar Nova Ficha de Personagem" size="xl"> 
        <div className="space-y-4"> 
            <input type="text" placeholder="Nome do Personagem" value={newCharName} onChange={e => setNewCharName(e.target.value)} className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-sky-500" /> 
            <input type="text" placeholder="Raça" value={newCharRace} onChange={e => setNewCharRace(e.target.value)} className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-sky-500" /> 
            <input type="text" placeholder="Classe" value={newCharClass} onChange={e => setNewCharClass(e.target.value)} className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-sky-500" /> 
            <div className="grid grid-cols-3 gap-4"> 
                <input type="number" placeholder="Nível" value={newCharLevel} onChange={e => setNewCharLevel(e.target.value)} className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-sky-500" /> 
                <input type="number" placeholder="PV Atual" value={newCharHp} onChange={e => setNewCharHp(e.target.value)} className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-sky-500" /> 
                <input type="number" placeholder="PV Máximo" value={newCharMaxHp} onChange={e => setNewCharMaxHp(e.target.value)} className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-sky-500" /> 
            </div> 
            <textarea placeholder="História do Personagem (opcional)..." value={newCharHistory} onChange={e => setNewCharHistory(e.target.value)} rows="5" className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-sky-500 custom-scrollbar"></textarea>
            <input type="url" placeholder="URL da Imagem (opcional)" value={newCharImageUrl} onChange={e => {setNewCharImageUrl(e.target.value); setNewCharImageFile(null);}} className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-sky-500" disabled={!!newCharImageFile}/>
            {storageGlobal && <>
                <div className="text-sm text-gray-400 text-center my-1">OU</div>
                <label className="block">
                    <span className="text-gray-300 text-sm">Upload de Imagem:</span>
                    <input type="file" accept="image/*" onChange={handleFileChange} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100 mt-1"/>
                </label>
                {newCharImageFile && <p className="text-xs text-sky-400">Arquivo selecionado: {newCharImageFile.name}</p>}
            </>}
            <button onClick={handleAddCharacter} disabled={isUploading} className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 px-4 rounded-md transition-colors flex items-center justify-center disabled:opacity-50"> 
                {isUploading ? <Icon name="UploadCloud" className="animate-ping mr-2" /> : <Icon name="PlusCircle" size={20} className="mr-2" />} 
                {isUploading ? "Enviando Imagem..." : "Salvar Personagem"}
            </button> 
        </div> 
    </Modal> 
    <Modal isOpen={showDeleteConfirmModal} onClose={() => { setShowDeleteConfirmModal(false); setCharToDelete(null); }} title="Confirmar Deleção" size="sm"> <p className="mb-6">Tem certeza que deseja deletar a ficha de <strong className="text-sky-400">{charToDelete?.name}</strong>? Esta ação não pode ser desfeita.</p> <div className="flex justify-end gap-3"> <button onClick={() => { setShowDeleteConfirmModal(false); setCharToDelete(null); }} className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-md transition-colors">Cancelar</button> <button onClick={confirmDeleteCharacter} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors">Deletar</button> </div> </Modal> 
    {viewingCharHistory && (
        <Modal isOpen={isHistoryModalOpen} onClose={() => setIsHistoryModalOpen(false)} title={`História de ${viewingCharHistory.name}`} size="xl">
            <div className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none p-2 bg-gray-750 rounded-md custom-scrollbar">
                <pre className="whitespace-pre-wrap text-gray-200 text-sm break-words">{viewingCharHistory.history || "Nenhuma história registrada."}</pre>
            </div>
            <div className="mt-6 flex justify-end">
                <button onClick={() => setIsHistoryModalOpen(false)} className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-md transition-colors">Fechar</button>
            </div>
        </Modal>
    )}
    </div> );
};

// Componente Wiki da Campanha (Extraído)
const WikiCampaignComponent = ({ addToast, db, userId, appId }) => {
    const [wikiEntries, setWikiEntries] = useState([]); const [isLoading, setIsLoading] = useState(true); const [isEntryModalOpen, setIsEntryModalOpen] = useState(false); const [currentEntry, setCurrentEntry] = useState(null); const [viewingEntry, setViewingEntry] = useState(null); const [entryTitle, setEntryTitle] = useState(''); const [entryContent, setEntryContent] = useState('');
    const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false); const [entryToDelete, setEntryToDelete] = useState(null);
    const [searchTerm, setSearchTerm] = useState(''); 

    const wikiCollectionPath = `artifacts/${appId}/public/data/campaignWiki`;
    useEffect(() => { if (!db) { setIsLoading(false); return; } setIsLoading(true); const wikiRef = db.collection(wikiCollectionPath); const unsubscribe = wikiRef.onSnapshot(querySnapshot => { const entriesData = []; querySnapshot.forEach(doc => { entriesData.push({ id: doc.id, ...doc.data() }); }); entriesData.sort((a, b) => a.title.localeCompare(b.title)); setWikiEntries(entriesData); setIsLoading(false); }, error => { console.error("Erro ao carregar entradas da wiki: ", error); addToast("Erro ao carregar entradas da wiki: " + error.message, "error"); setIsLoading(false); }); return () => unsubscribe(); }, [db, appId, wikiCollectionPath, addToast]);
    
    const filteredWikiEntries = wikiEntries.filter(entry => 
        entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleOpenNewEntryModal = () => { setCurrentEntry(null); setEntryTitle(''); setEntryContent(''); setIsEntryModalOpen(true); };
    const handleOpenEditEntryModal = (entry) => { setCurrentEntry(entry); setEntryTitle(entry.title); setEntryContent(entry.content); setIsEntryModalOpen(true); setViewingEntry(null); };
    const handleOpenViewEntryModal = (entry) => { setViewingEntry(entry); setIsEntryModalOpen(false); };
    const handleSaveEntry = async () => { if (!db) { addToast("Erro: Banco de dados não disponível.", "error"); return; } if (!entryTitle.trim() || !entryContent.trim()) { addToast("Título e conteúdo são obrigatórios.", "error"); return; } const entryData = { title: entryTitle, content: entryContent, updatedAt: serverTimestampGlobal(), }; try { if (currentEntry && currentEntry.id) { await db.collection(wikiCollectionPath).doc(currentEntry.id).update(entryData); addToast("Entrada da wiki atualizada!", "success"); } else { entryData.createdAt = serverTimestampGlobal(); await db.collection(wikiCollectionPath).add(entryData); addToast("Nova entrada da wiki criada!", "success"); } setIsEntryModalOpen(false); setCurrentEntry(null); setEntryTitle(''); setEntryContent(''); } catch (error) { console.error("Erro ao salvar entrada da wiki: ", error); addToast("Erro ao salvar entrada: " + error.message, "error"); } };
    const handleDeleteRequest = (entry) => { setEntryToDelete(entry); setShowDeleteConfirmModal(true); };
    const confirmDeleteEntry = async () => { if (!db || !entryToDelete || !entryToDelete.id) { addToast("Erro: Não foi possível deletar a entrada.", "error"); setShowDeleteConfirmModal(false); setEntryToDelete(null); return; } try { await db.collection(wikiCollectionPath).doc(entryToDelete.id).delete(); addToast(`Entrada "${entryToDelete.title}" deletada.`, "success"); if (viewingEntry && viewingEntry.id === entryToDelete.id) { setViewingEntry(null); } } catch (error) { console.error("Erro ao deletar entrada da wiki: ", error); addToast("Erro ao deletar entrada: " + error.message, "error"); } finally { setShowDeleteConfirmModal(false); setEntryToDelete(null); } };
    return ( <div className="space-y-6"> <div className="flex flex-col sm:flex-row justify-between items-center gap-4"> <h2 className="text-2xl font-semibold text-sky-400 flex items-center"><Icon name="BookMarked" size={28} className="mr-3" />Wiki da Campanha</h2> <button onClick={handleOpenNewEntryModal} className="bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-3 rounded-md flex items-center transition-colors text-sm self-start sm:self-center"> <Icon name="PlusCircle" size={18} className="mr-2" /> Nova Entrada na Wiki </button> </div> 
    <div className="mb-4">
        <input 
            type="text"
            placeholder="Pesquisar na Wiki (título ou conteúdo)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-sky-500"
        />
    </div>
    {isLoading && <p className="text-gray-400">Carregando entradas da wiki...</p>} 
    {!isLoading && filteredWikiEntries.length === 0 && searchTerm && <p className="text-gray-400 text-center py-8">Nenhuma entrada encontrada para "{searchTerm}".</p>}
    {!isLoading && wikiEntries.length === 0 && !searchTerm && ( <p className="text-gray-400 text-center py-8">Nenhuma entrada na wiki ainda. Crie a primeira!</p> )} 
    {!isLoading && filteredWikiEntries.length > 0 && ( <div className="bg-gray-800 p-4 rounded-lg shadow-lg"> <h3 className="text-xl font-semibold text-sky-300 mb-3">Artigos da Wiki ({filteredWikiEntries.length})</h3> <ul className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar"> {filteredWikiEntries.map(entry => ( <li key={entry.id} className="flex justify-between items-center p-3 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors"> <button onClick={() => handleOpenViewEntryModal(entry)} className="text-sky-400 hover:text-sky-300 text-left flex-grow truncate pr-2" title={entry.title}> {entry.title} </button> <div className="flex-shrink-0 flex gap-2 ml-2"> <button onClick={() => handleOpenEditEntryModal(entry)} className="p-1 text-gray-400 hover:text-yellow-400" title="Editar"> <Icon name="Edit3" size={16} /> </button> <button onClick={() => handleDeleteRequest(entry)} className="p-1 text-gray-400 hover:text-red-500" title="Deletar"> <Icon name="Trash2" size={16} /> </button> </div> </li> ))} </ul> </div> )} <Modal isOpen={isEntryModalOpen} onClose={() => setIsEntryModalOpen(false)} title={currentEntry ? "Editar Entrada da Wiki" : "Nova Entrada da Wiki"} size="xl"> <div className="space-y-4"> <input type="text" placeholder="Título da Entrada" value={entryTitle} onChange={e => setEntryTitle(e.target.value)} className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-sky-500" /> <textarea placeholder="Conteúdo da Entrada..." value={entryContent} onChange={e => setEntryContent(e.target.value)} rows="15" className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-sky-500 custom-scrollbar" ></textarea> <button onClick={handleSaveEntry} className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 px-4 rounded-md transition-colors flex items-center justify-center"> <Icon name="FileText" size={20} className="mr-2" /> Salvar Entrada </button> </div> </Modal> {viewingEntry && ( <Modal isOpen={!!viewingEntry} onClose={() => setViewingEntry(null)} title={viewingEntry.title} size="xl"> <div className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none p-2 bg-gray-750 rounded-md custom-scrollbar"> <pre className="whitespace-pre-wrap text-gray-200 text-sm break-words">{viewingEntry.content}</pre> </div> <div className="mt-6 flex justify-end gap-3"> <button onClick={() => { handleOpenEditEntryModal(viewingEntry); }} className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md transition-colors flex items-center"> <Icon name="Edit3" size={18} className="mr-2"/> Editar </button> <button onClick={() => setViewingEntry(null)} className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-md transition-colors"> Fechar </button> </div> </Modal> )} <Modal isOpen={showDeleteConfirmModal} onClose={() => { setShowDeleteConfirmModal(false); setEntryToDelete(null); }} title="Confirmar Deleção de Entrada da Wiki" size="sm"> <p className="mb-6">Tem certeza que deseja deletar a entrada <strong className="text-sky-400">{entryToDelete?.title}</strong>? Esta ação não pode ser desfeita.</p> <div className="flex justify-end gap-3"> <button onClick={() => { setShowDeleteConfirmModal(false); setEntryToDelete(null); }} className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-md transition-colors">Cancelar</button> <button onClick={confirmDeleteEntry} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors">Deletar</button> </div> </Modal> </div> );
};

// Componente Diário do Mestre
const MasterJournalComponent = ({ addToast, db, userId, appId }) => {
    const [journalEntries, setJournalEntries] = useState([]); const [isLoading, setIsLoading] = useState(true); const [isEntryModalOpen, setIsEntryModalOpen] = useState(false); const [currentEntry, setCurrentEntry] = useState(null); const [viewingEntry, setViewingEntry] = useState(null); const [entryTitle, setEntryTitle] = useState(''); const [entryContent, setEntryContent] = useState('');
    const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false); const [entryToDelete, setEntryToDelete] = useState(null);
    const [searchTerm, setSearchTerm] = useState(''); 

    const journalCollectionPath = `artifacts/${appId}/users/${userId}/masterJournal`;

    useEffect(() => {
        if (!db || !userId) { setIsLoading(false); return; }
        setIsLoading(true);
        const journalRef = db.collection(journalCollectionPath).orderBy("createdAt", "desc"); 
        const unsubscribe = journalRef.onSnapshot(querySnapshot => {
            const entriesData = [];
            querySnapshot.forEach(doc => { entriesData.push({ id: doc.id, ...doc.data() }); });
            setJournalEntries(entriesData);
            setIsLoading(false);
        }, error => {
            console.error("Erro ao carregar entradas do diário: ", error);
            addToast("Erro ao carregar entradas do diário: " + error.message, "error");
            setIsLoading(false);
        });
        return () => unsubscribe();
    }, [db, userId, appId, journalCollectionPath, addToast]);

    const filteredJournalEntries = journalEntries.filter(entry => 
        entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleOpenNewEntryModal = () => { setCurrentEntry(null); setEntryTitle(''); setEntryContent(''); setIsEntryModalOpen(true); };
    const handleOpenEditEntryModal = (entry) => { setCurrentEntry(entry); setEntryTitle(entry.title); setEntryContent(entry.content); setIsEntryModalOpen(true); setViewingEntry(null); };
    const handleOpenViewEntryModal = (entry) => { setViewingEntry(entry); setIsEntryModalOpen(false); };
    const handleSaveEntry = async () => {
        if (!db || !userId) { addToast("Erro: Usuário ou DB não disponível.", "error"); return; }
        if (!entryTitle.trim() || !entryContent.trim()) { addToast("Título e conteúdo são obrigatórios.", "error"); return; }
        const entryData = { title: entryTitle, content: entryContent, updatedAt: serverTimestampGlobal(), };
        try {
            if (currentEntry && currentEntry.id) {
                await db.collection(journalCollectionPath).doc(currentEntry.id).update(entryData);
                addToast("Entrada do diário atualizada!", "success");
            } else {
                entryData.createdAt = serverTimestampGlobal();
                await db.collection(journalCollectionPath).add(entryData);
                addToast("Nova entrada no diário criada!", "success");
            }
            setIsEntryModalOpen(false); setCurrentEntry(null); setEntryTitle(''); setEntryContent('');
        } catch (error) { console.error("Erro ao salvar entrada do diário: ", error); addToast("Erro ao salvar entrada do diário: " + error.message, "error"); }
    };
    const handleDeleteRequest = (entry) => { setEntryToDelete(entry); setShowDeleteConfirmModal(true); };
    const confirmDeleteEntry = async () => {
        if (!db || !userId || !entryToDelete || !entryToDelete.id) { addToast("Erro: Não foi possível deletar a entrada.", "error"); setShowDeleteConfirmModal(false); setEntryToDelete(null); return; }
        try {
            await db.collection(journalCollectionPath).doc(entryToDelete.id).delete();
            addToast(`Entrada "${entryToDelete.title}" deletada do diário.`, "success");
            if (viewingEntry && viewingEntry.id === entryToDelete.id) { setViewingEntry(null); }
        } catch (error) { console.error("Erro ao deletar entrada do diário: ", error); addToast("Erro ao deletar entrada do diário: " + error.message, "error"); }
        finally { setShowDeleteConfirmModal(false); setEntryToDelete(null); }
    };

    return ( <div className="space-y-6"> <div className="flex flex-col sm:flex-row justify-between items-center gap-4"> <h2 className="text-2xl font-semibold text-sky-400 flex items-center"><Icon name="BookLock" size={28} className="mr-3" />Diário do Mestre (Privado)</h2> <button onClick={handleOpenNewEntryModal} className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-3 rounded-md flex items-center transition-colors text-sm self-start sm:self-center"> <Icon name="PlusCircle" size={18} className="mr-2" /> Nova Anotação </button> </div> 
    <div className="mb-4">
        <input 
            type="text"
            placeholder="Pesquisar no Diário (título ou conteúdo)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-teal-500"
        />
    </div>
    {isLoading && <p className="text-gray-400">Carregando anotações do diário...</p>} 
    {!isLoading && filteredJournalEntries.length === 0 && searchTerm && <p className="text-gray-400 text-center py-8">Nenhuma anotação encontrada para "{searchTerm}".</p>}
    {!isLoading && journalEntries.length === 0 && !searchTerm && ( <p className="text-gray-400 text-center py-8">Nenhuma anotação no diário ainda. Crie a primeira!</p> )} 
    {!isLoading && filteredJournalEntries.length > 0 && ( <div className="bg-gray-800 p-4 rounded-lg shadow-lg"> <h3 className="text-xl font-semibold text-sky-300 mb-3">Suas Anotações ({filteredJournalEntries.length})</h3> <ul className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar"> {filteredJournalEntries.map(entry => ( <li key={entry.id} className="flex justify-between items-center p-3 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors"> <div> <button onClick={() => handleOpenViewEntryModal(entry)} className="text-sky-400 hover:text-sky-300 text-left font-medium" title={entry.title}> {entry.title} </button> <p className="text-xs text-gray-400 mt-1"> Atualizado em: {entry.updatedAt?.toDate().toLocaleDateString()} </p> </div> <div className="flex-shrink-0 flex gap-2 ml-2"> <button onClick={() => handleOpenEditEntryModal(entry)} className="p-1 text-gray-400 hover:text-yellow-400" title="Editar"> <Icon name="Edit3" size={16} /> </button> <button onClick={() => handleDeleteRequest(entry)} className="p-1 text-gray-400 hover:text-red-500" title="Deletar"> <Icon name="Trash2" size={16} /> </button> </div> </li> ))} </ul> </div> )} <Modal isOpen={isEntryModalOpen} onClose={() => setIsEntryModalOpen(false)} title={currentEntry ? "Editar Anotação do Diário" : "Nova Anotação no Diário"} size="xl"> <div className="space-y-4"> <input type="text" placeholder="Título da Anotação" value={entryTitle} onChange={e => setEntryTitle(e.target.value)} className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-sky-500" /> <textarea placeholder="Conteúdo da Anotação..." value={entryContent} onChange={e => setEntryContent(e.target.value)} rows="15" className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-sky-500 custom-scrollbar" ></textarea> <button onClick={handleSaveEntry} className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-4 rounded-md transition-colors flex items-center justify-center"> <Icon name="Save" size={20} className="mr-2" /> Salvar Anotação </button> </div> </Modal> {viewingEntry && ( <Modal isOpen={!!viewingEntry} onClose={() => setViewingEntry(null)} title={viewingEntry.title} size="xl"> <div className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none p-2 bg-gray-750 rounded-md custom-scrollbar"> <pre className="whitespace-pre-wrap text-gray-200 text-sm break-words">{viewingEntry.content}</pre> </div> <div className="mt-6 flex justify-end gap-3"> <button onClick={() => { handleOpenEditEntryModal(viewingEntry); }} className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md transition-colors flex items-center"> <Icon name="Edit3" size={18} className="mr-2"/> Editar </button> <button onClick={() => setViewingEntry(null)} className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-md transition-colors"> Fechar </button> </div> </Modal> )} <Modal isOpen={showDeleteConfirmModal} onClose={() => { setShowDeleteConfirmModal(false); setEntryToDelete(null); }} title="Confirmar Deleção de Anotação" size="sm"> <p className="mb-6">Tem certeza que deseja deletar a anotação <strong className="text-sky-400">{entryToDelete?.title}</strong>? Esta ação não pode ser desfeita.</p> <div className="flex justify-end gap-3"> <button onClick={() => { setShowDeleteConfirmModal(false); setEntryToDelete(null); }} className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-md transition-colors">Cancelar</button> <button onClick={confirmDeleteEntry} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors">Deletar</button> </div> </Modal> </div> );
};


// Componente para Seção de Campanha (Pai)
const CampanhaScreen = ({ addToast, db, userId, appId }) => {
    const [activeTab, setActiveTab] = useState('wiki'); // 'wiki', 'journal', ou 'bestiary'

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                 <h1 className="text-3xl font-bold text-sky-400 flex items-center"><Icon name="BookOpen" size={32} className="mr-3" />Gerenciador da Campanha</h1>
            </div>

            <div className="flex border-b border-gray-700 mb-6">
                <button 
                    onClick={() => setActiveTab('wiki')}
                    className={`py-3 px-6 font-medium transition-colors ${activeTab === 'wiki' ? 'border-b-2 border-sky-500 text-sky-400' : 'text-gray-400 hover:text-sky-400'}`}
                >
                    <Icon name="BookMarked" size={18} className="inline mr-2"/> Wiki da Campanha
                </button>
                <button 
                    onClick={() => setActiveTab('journal')}
                    className={`py-3 px-6 font-medium transition-colors ${activeTab === 'journal' ? 'border-b-2 border-teal-500 text-teal-400' : 'text-gray-400 hover:text-teal-400'}`}
                >
                   <Icon name="BookLock" size={18} className="inline mr-2"/> Diário do Mestre
                </button>
                 <button 
                    onClick={() => setActiveTab('bestiary')}
                    className={`py-3 px-6 font-medium transition-colors ${activeTab === 'bestiary' ? 'border-b-2 border-red-500 text-red-400' : 'text-gray-400 hover:text-red-400'}`}
                >
                   <Icon name="Bug" size={18} className="inline mr-2"/> Bestiário
                </button>
            </div>

            {activeTab === 'wiki' && <WikiCampaignComponent addToast={addToast} db={db} userId={userId} appId={appId} />}
            {activeTab === 'journal' && <MasterJournalComponent addToast={addToast} db={db} userId={userId} appId={appId} />}
            {activeTab === 'bestiary' && <BestiaryComponent addToast={addToast} db={db} userId={userId} appId={appId} />}
        </div>
    );
};

// Componente Bestiário
const BestiaryComponent = ({ addToast, db, userId, appId }) => {
    const [monsters, setMonsters] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isMonsterModalOpen, setIsMonsterModalOpen] = useState(false);
    const [currentMonster, setCurrentMonster] = useState(null); 
    const [viewingMonster, setViewingMonster] = useState(null); 
    const [searchTerm, setSearchTerm] = useState(''); 

    const initialMonsterData = { name: '', description: '', imageUrl: '', hp: '', ac: '', attacks: '', specialAbilities: '', challenge: '' };
    const [monsterFormData, setMonsterFormData] = useState(initialMonsterData);
    const [monsterImageFile, setMonsterImageFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);


    const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
    const [monsterToDelete, setMonsterToDelete] = useState(null);

    const bestiaryCollectionPath = `artifacts/${appId}/public/data/bestiary`;

    useEffect(() => {
        if (!db) { setIsLoading(false); return; } 
        setIsLoading(true);
        const bestiaryRef = db.collection(bestiaryCollectionPath).orderBy("name", "asc");
        const unsubscribe = bestiaryRef.onSnapshot(querySnapshot => {
            const monstersData = [];
            querySnapshot.forEach(doc => { monstersData.push({ id: doc.id, ...doc.data() }); });
            setMonsters(monstersData);
            setIsLoading(false);
        }, error => {
            console.error("Erro ao carregar bestiário: ", error);
            addToast("Erro ao carregar bestiário: " + error.message, "error");
            setIsLoading(false);
        });
        return () => unsubscribe();
    }, [db, appId, bestiaryCollectionPath, addToast]);

    const filteredMonsters = monsters.filter(monster => 
        monster.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (monster.description && monster.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (monster.challenge && monster.challenge.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setMonsterImageFile(e.target.files[0]);
            setMonsterFormData(prev => ({...prev, imageUrl: ''})); 
        }
    };

    const handleOpenNewMonsterModal = () => {
        setCurrentMonster(null);
        setMonsterFormData(initialMonsterData);
        setMonsterImageFile(null);
        setIsMonsterModalOpen(true);
    };

    const handleOpenEditMonsterModal = (monster) => {
        setCurrentMonster(monster);
        setMonsterFormData({
            name: monster.name || '',
            description: monster.description || '',
            imageUrl: monster.imageUrl || '',
            hp: monster.hp || '',
            ac: monster.ac || '',
            attacks: monster.attacks || '',
            specialAbilities: monster.specialAbilities || '',
            challenge: monster.challenge || ''
        });
        setMonsterImageFile(null);
        setIsMonsterModalOpen(true);
        setViewingMonster(null);
    };
    
    const handleOpenViewMonsterModal = (monster) => {
        setViewingMonster(monster);
        setIsMonsterModalOpen(false);
    };

    const handleSaveMonster = async () => {
        if (!db || !userId) { 
            addToast("Erro: Usuário ou DB não disponível para salvar.", "error");
            return;
        }
        if (!monsterFormData.name.trim()) {
            addToast("O nome do monstro é obrigatório.", "error");
            return;
        }

        let finalImageUrl = monsterFormData.imageUrl.trim();
        if (monsterImageFile && storageGlobal) {
            setIsUploading(true);
            const uploadedUrl = await uploadFileToStorage(monsterImageFile, `bestiaryImages/${appId}`, addToast); 
            setIsUploading(false);
            if (uploadedUrl) {
                finalImageUrl = uploadedUrl;
            } else {
                 addToast("Falha no upload da imagem. O monstro será salvo com a URL anterior ou sem imagem.", "warning");
            }
        } else if (monsterImageFile && !storageGlobal) {
            addToast("Serviço de Storage não disponível. Imagem não será enviada.", "warning");
        }
        
        const dataToSave = { ...monsterFormData, imageUrl: finalImageUrl || '', updatedAt: serverTimestampGlobal() };

        try {
            if (currentMonster && currentMonster.id) {
                await db.collection(bestiaryCollectionPath).doc(currentMonster.id).update(dataToSave);
                addToast("Monstro atualizado com sucesso!", "success");
            } else {
                dataToSave.createdAt = serverTimestampGlobal();
                await db.collection(bestiaryCollectionPath).add(dataToSave);
                addToast("Novo monstro adicionado ao bestiário!", "success");
            }
            setIsMonsterModalOpen(false);
            setCurrentMonster(null);
            setMonsterImageFile(null);
        } catch (error) {
            console.error("Erro ao salvar monstro: ", error);
            addToast("Erro ao salvar monstro: " + error.message, "error");
        }
    };

    const handleDeleteRequest = (monster) => {
        setMonsterToDelete(monster);
        setShowDeleteConfirmModal(true);
    };

    const confirmDeleteMonster = async () => {
        if (!db || !userId || !monsterToDelete || !monsterToDelete.id) {
            addToast("Erro: Não foi possível deletar o monstro.", "error");
            setShowDeleteConfirmModal(false); setMonsterToDelete(null); return;
        }
        try {
            await db.collection(bestiaryCollectionPath).doc(monsterToDelete.id).delete();
            addToast(`Monstro "${monsterToDelete.name}" deletado.`, "success");
            if (viewingMonster && viewingMonster.id === monsterToDelete.id) {
                setViewingMonster(null);
            }
        } catch (error) {
            console.error("Erro ao deletar monstro: ", error);
            addToast("Erro ao deletar monstro: " + error.message, "error");
        } finally {
            setShowDeleteConfirmModal(false); setMonsterToDelete(null);
        }
    };
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setMonsterFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <h2 className="text-2xl font-semibold text-sky-400 flex items-center">
                    <Icon name="Bug" size={28} className="mr-3 text-red-400" />Bestiário da Campanha
                </h2>
                {userId && 
                    <button onClick={handleOpenNewMonsterModal} className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-3 rounded-md flex items-center transition-colors text-sm self-start sm:self-center">
                        <Icon name="PlusCircle" size={18} className="mr-2" /> Adicionar Criatura
                    </button>
                }
            </div>
             <div className="mb-4">
                <input 
                    type="text"
                    placeholder="Pesquisar no Bestiário (nome, descrição, ND)..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-red-500"
                />
            </div>

            {isLoading && <p className="text-gray-400">Carregando criaturas...</p>}
            {!isLoading && filteredMonsters.length === 0 && searchTerm && <p className="text-gray-400 text-center py-8">Nenhuma criatura encontrada para "{searchTerm}".</p>}
            {!isLoading && monsters.length === 0 && !searchTerm && (
                <p className="text-gray-400 text-center py-8">Nenhuma criatura no bestiário. Adicione a primeira!</p>
            )}

            {!isLoading && filteredMonsters.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredMonsters.map(monster => (
                        <div key={monster.id} className="bg-gray-700 rounded-lg shadow-lg overflow-hidden hover:shadow-red-500/30 transition-shadow">
                            {monster.imageUrl ? (
                                <img 
                                    src={monster.imageUrl} 
                                    alt={`Imagem de ${monster.name}`} 
                                    className="w-full h-40 object-cover" 
                                    onError={(e) => { e.target.src = 'https://placehold.co/300x200/374151/9ca3af?text=Sem+Imagem'; }}
                                />
                            ) : (
                                 <div className="w-full h-40 bg-gray-600 flex items-center justify-center">
                                    <Icon name="Bug" size={48} className="text-gray-500" />
                                 </div>
                            )}
                            <div className="p-4">
                                <h3 className="text-xl font-bold text-red-400 mb-1 truncate" title={monster.name}>{monster.name}</h3>
                                <p className="text-xs text-gray-400 mb-2 truncate">ND: {monster.challenge || 'N/A'}</p>
                                <p className="text-sm text-gray-300 h-16 overflow-hidden text-ellipsis mb-3">{monster.description || "Sem descrição."}</p>
                                <div className="flex justify-between items-center">
                                    <button onClick={() => handleOpenViewMonsterModal(monster)} className="text-sm bg-sky-600 hover:bg-sky-700 text-white py-1 px-3 rounded-md">Ver Detalhes</button>
                                    {userId && 
                                        <div className="flex gap-2">
                                            <button onClick={() => handleOpenEditMonsterModal(monster)} className="p-1 text-gray-400 hover:text-yellow-400" title="Editar"><Icon name="Edit3" size={16}/></button>
                                            <button onClick={() => handleDeleteRequest(monster)} className="p-1 text-gray-400 hover:text-red-500" title="Deletar"><Icon name="Trash2" size={16}/></button>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Modal isOpen={isMonsterModalOpen} onClose={() => {setIsMonsterModalOpen(false); setMonsterImageFile(null);}} title={currentMonster ? "Editar Criatura" : "Adicionar Nova Criatura"} size="2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" name="name" placeholder="Nome da Criatura" value={monsterFormData.name} onChange={handleInputChange} className="md:col-span-2 w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-red-500" />
                    <textarea name="description" placeholder="Descrição" value={monsterFormData.description} onChange={handleInputChange} rows="5" className="md:col-span-2 w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-red-500 custom-scrollbar"></textarea>
                    <input type="url" name="imageUrl" placeholder="URL da Imagem (opcional)" value={monsterFormData.imageUrl} onChange={e => {setMonsterFormData({...monsterFormData, imageUrl: e.target.value }); setMonsterImageFile(null);}} className="md:col-span-2 w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-red-500" disabled={!!monsterImageFile} />
                    {storageGlobal && <>
                        <div className="md:col-span-2 text-sm text-gray-400 text-center my-1">OU</div>
                        <label className="md:col-span-2 block">
                            <span className="text-gray-300 text-sm">Upload de Imagem:</span>
                            <input type="file" accept="image/*" onChange={handleFileChange} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100 mt-1"/>
                        </label>
                        {monsterImageFile && <p className="md:col-span-2 text-xs text-sky-400">Arquivo selecionado: {monsterImageFile.name}</p>}
                    </>}

                    <input type="text" name="hp" placeholder="Pontos de Vida (ex: 27 ou 5d8+5)" value={monsterFormData.hp} onChange={handleInputChange} className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-red-500" />
                    <input type="text" name="ac" placeholder="Classe de Armadura (ex: 15)" value={monsterFormData.ac} onChange={handleInputChange} className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-red-500" />
                    <textarea name="attacks" placeholder="Ataques (ex: Garra: +5, 1d6+3 dano)" value={monsterFormData.attacks} onChange={handleInputChange} rows="5" className="md:col-span-2 w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-red-500 custom-scrollbar"></textarea>
                    <textarea name="specialAbilities" placeholder="Habilidades Especiais" value={monsterFormData.specialAbilities} onChange={handleInputChange} rows="5" className="md:col-span-2 w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-red-500 custom-scrollbar"></textarea>
                    <input type="text" name="challenge" placeholder="Nível de Desafio / XP (opcional)" value={monsterFormData.challenge} onChange={handleInputChange} className="md:col-span-2 w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-red-500" />
                </div>
                <button onClick={handleSaveMonster} disabled={isUploading} className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-md transition-colors flex items-center justify-center disabled:opacity-50">
                    {isUploading ? <Icon name="UploadCloud" className="animate-ping mr-2" /> : <Icon name="Save" size={20} className="mr-2" />}
                    {isUploading ? "Enviando Imagem..." : (currentMonster ? "Salvar Alterações" : "Adicionar Criatura")}
                </button>
            </Modal>

            {viewingMonster && (
                <Modal isOpen={!!viewingMonster} onClose={() => setViewingMonster(null)} title={viewingMonster.name} size="xl">
                    <div className="space-y-3">
                        {viewingMonster.imageUrl && <img src={viewingMonster.imageUrl} alt={viewingMonster.name} className="max-h-60 w-auto mx-auto rounded-md mb-3" onError={(e) => { e.target.style.display='none'; }}/>}
                        <p><strong className="text-red-400">Descrição:</strong> <span className="whitespace-pre-wrap">{viewingMonster.description || "N/A"}</span></p>
                        <p><strong className="text-red-400">HP:</strong> {viewingMonster.hp || "N/A"} | <strong className="text-red-400">AC:</strong> {viewingMonster.ac || "N/A"}</p>
                        <p><strong className="text-red-400">Ataques:</strong> <span className="whitespace-pre-wrap">{viewingMonster.attacks || "N/A"}</span></p>
                        <p><strong className="text-red-400">Habilidades Especiais:</strong> <span className="whitespace-pre-wrap">{viewingMonster.specialAbilities || "N/A"}</span></p>
                        <p><strong className="text-red-400">ND/XP:</strong> {viewingMonster.challenge || "N/A"}</p>
                    </div>
                     <div className="mt-6 flex justify-end gap-3">
                        {userId && 
                            <button onClick={() => { handleOpenEditMonsterModal(viewingMonster); }} className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md transition-colors flex items-center"> <Icon name="Edit3" size={18} className="mr-2"/> Editar </button>
                        }
                        <button onClick={() => setViewingMonster(null)} className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-md transition-colors"> Fechar </button>
                    </div>
                </Modal>
            )}
            <Modal isOpen={showDeleteConfirmModal} onClose={() => { setShowDeleteConfirmModal(false); setMonsterToDelete(null); }} title="Confirmar Deleção de Criatura" size="sm">
                <p className="mb-6">Tem certeza que deseja deletar a criatura <strong className="text-red-400">{monsterToDelete?.name}</strong>? Esta ação não pode ser desfeita.</p>
                <div className="flex justify-end gap-3">
                    <button onClick={() => { setShowDeleteConfirmModal(false); setMonsterToDelete(null); }} className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-md transition-colors">Cancelar</button>
                    <button onClick={confirmDeleteMonster} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors">Deletar</button>
                </div>
            </Modal>
        </div>
    );
};


// Componente para Seção de Mapas
const MapasScreen = ({ addToast, db, userId, appId }) => {
    const [maps, setMaps] = useState([]); 
    const [isLoading, setIsLoading] = useState(true); 
    const [isMapModalOpen, setIsMapModalOpen] = useState(false); 
    const [currentMapData, setCurrentMapData] = useState({ name: '', description: '', imageUrl: '', fogOfWar: { enabled: false, gridSize: 10, revealedCells: [] } }); 
    const [mapImageFile, setMapImageFile] = useState(null); 
    const [isUploadingMapImage, setIsUploadingMapImage] = useState(false); 

    const [editingMap, setEditingMap] = useState(null); 
    const [selectedMap, setSelectedMap] = useState(null);
    const [isMarkerModalOpen, setIsMarkerModalOpen] = useState(false); 
    const [currentMarkerData, setCurrentMarkerData] = useState({ description: '', icon: 'MapPin' }); 
    const [editingMarker, setEditingMarker] = useState(null); 
    const [viewingMarker, setViewingMarker] = useState(null); 
    const [markerCoords, setMarkerCoords] = useState({ x: 0, y: 0 });
    const [mapImageDimensions, setMapImageDimensions] = useState({ width: 0, height: 0 }); 
    const imageContainerRef = useRef(null);
    const [showDeleteMapConfirmModal, setShowDeleteMapConfirmModal] = useState(false); 
    const [mapToDelete, setMapToDelete] = useState(null); 
    const [showDeleteMarkerConfirmModal, setShowDeleteMarkerConfirmModal] = useState(false); 
    const [markerToDelete, setMarkerToDelete] = useState(null);
    const [editingFog, setEditingFog] = useState(false); 

    const mapsCollectionPath = `artifacts/${appId}/public/data/campaignMaps`;
    useEffect(() => { if (!db) { setIsLoading(false); return; } setIsLoading(true); const mapsRef = db.collection(mapsCollectionPath); const unsubscribe = mapsRef.onSnapshot(querySnapshot => { const mapsData = []; querySnapshot.forEach(doc => { mapsData.push({ id: doc.id, ...doc.data() }); }); mapsData.sort((a,b) => a.name.localeCompare(b.name)); setMaps(mapsData); setIsLoading(false); }, error => { console.error("Erro ao carregar mapas: ", error); addToast("Erro ao carregar mapas: " + error.message, "error"); setIsLoading(false); }); return () => unsubscribe(); }, [db, appId, mapsCollectionPath, addToast]);
    useEffect(() => { if (selectedMap && selectedMap.imageUrl) { const img = new Image(); img.onload = () => { setMapImageDimensions({ width: img.width, height: img.height }); }; img.onerror = () => { addToast("Erro ao carregar imagem do mapa.", "error"); setMapImageDimensions({ width: 0, height: 0 }); }; img.src = selectedMap.imageUrl; } else { setMapImageDimensions({ width: 0, height: 0 }); } }, [selectedMap, addToast]);
    
    const handleMapFileChange = (e) => {
        if (e.target.files[0]) {
            setMapImageFile(e.target.files[0]);
            setCurrentMapData(prev => ({...prev, imageUrl: ''})); 
        }
    };

    const handleOpenNewMapModal = () => { setEditingMap(null); setCurrentMapData({ name: '', description: '', imageUrl: '', fogOfWar: { enabled: false, gridSize: 10, revealedCells: [] } }); setMapImageFile(null); setIsMapModalOpen(true); };
    const handleOpenEditMapModal = (map) => { setEditingMap(map); setCurrentMapData({ name: map.name, description: map.description, imageUrl: map.imageUrl, fogOfWar: map.fogOfWar || { enabled: false, gridSize: 10, revealedCells: [] } }); setMapImageFile(null); setIsMapModalOpen(true); };
    
    const handleSaveMap = async () => {
        if (!db) { addToast("Erro: DB não disponível.", "error"); return; }
        
        let finalImageUrl = currentMapData.imageUrl.trim();
        if (mapImageFile && storageGlobal) {
            setIsUploadingMapImage(true);
            const uploadedUrl = await uploadFileToStorage(mapImageFile, `mapImages/${appId}`, addToast);
            setIsUploadingMapImage(false);
            if (uploadedUrl) {
                finalImageUrl = uploadedUrl;
            } else {
                addToast("Falha no upload da imagem do mapa. Verifique o console.", "error");
                if(!currentMapData.imageUrl && !editingMap?.imageUrl) return; 
            }
        } else if (mapImageFile && !storageGlobal) {
            addToast("Serviço de Storage não disponível. Imagem do mapa não será enviada.", "warning");
        }


        if (!currentMapData.name.trim() || !finalImageUrl) { addToast("Nome e Imagem do Mapa (URL ou Upload) são obrigatórios.", "error"); return; }
        
        const gridSize = parseInt(currentMapData.fogOfWar.gridSize, 10);
        if (currentMapData.fogOfWar.enabled && (isNaN(gridSize) || gridSize <=0 || gridSize > 50)) { 
            addToast("Tamanho da grade da Névoa de Guerra inválido (1-50).", "error"); return;
        }

        const mapDataToSave = { 
            name: currentMapData.name, 
            description: currentMapData.description, 
            imageUrl: finalImageUrl, 
            updatedAt: serverTimestampGlobal(), 
            markers: editingMap ? editingMap.markers || [] : [], 
            fogOfWar: {
                enabled: currentMapData.fogOfWar.enabled,
                gridSize: currentMapData.fogOfWar.enabled ? gridSize : 10, 
                revealedCells: editingMap && editingMap.fogOfWar ? editingMap.fogOfWar.revealedCells || [] : [] 
            }
        }; 
        if (editingMap && editingMap.fogOfWar && editingMap.fogOfWar.gridSize !== gridSize && mapDataToSave.fogOfWar.enabled) {
            mapDataToSave.fogOfWar.revealedCells = [];
            addToast("Tamanho da grade alterado, células reveladas da névoa foram resetadas.", "info");
        }

        try { 
            if (editingMap && editingMap.id) { 
                await db.collection(mapsCollectionPath).doc(editingMap.id).update(mapDataToSave); addToast("Mapa atualizado!", "success"); 
                if(selectedMap && selectedMap.id === editingMap.id) setSelectedMap(prev => ({...prev, ...mapDataToSave})); 
            } else { 
                mapDataToSave.createdAt = serverTimestampGlobal(); 
                await db.collection(mapsCollectionPath).add(mapDataToSave); addToast("Novo mapa criado!", "success"); 
            } 
            setIsMapModalOpen(false); setEditingMap(null); setMapImageFile(null);
        } catch (error) { console.error("Erro ao salvar mapa: ", error); addToast("Erro ao salvar mapa: " + error.message, "error"); } 
    };

    const handleDeleteMapRequest = (map) => { setMapToDelete(map); setShowDeleteMapConfirmModal(true); };
    const confirmDeleteMap = async () => { if (!db || !mapToDelete) { addToast("Erro ao preparar deleção do mapa.", "error"); return; } try { await db.collection(mapsCollectionPath).doc(mapToDelete.id).delete(); addToast(`Mapa "${mapToDelete.name}" deletado.`, "success"); if (selectedMap && selectedMap.id === mapToDelete.id) setSelectedMap(null); } catch (error) { console.error("Erro ao deletar mapa: ", error); addToast("Erro ao deletar mapa: " + error.message, "error"); } finally { setShowDeleteMapConfirmModal(false); setMapToDelete(null); } };
    
    const handleMapClickToAddMarker = (event) => { 
        if (!selectedMap || !imageContainerRef.current || editingFog) return; 
        const rect = imageContainerRef.current.getBoundingClientRect(); 
        const x = ((event.clientX - rect.left) / rect.width) * 100;  
        const y = ((event.clientY - rect.top) / rect.height) * 100; 
        setMarkerCoords({ x: parseFloat(x.toFixed(2)), y: parseFloat(y.toFixed(2)) }); 
        setCurrentMarkerData({ description: '', icon: 'MapPin' });  
        setEditingMarker(null); 
        setIsMarkerModalOpen(true); 
    };
    const handleOpenViewMarkerModal = (marker) => { setViewingMarker(marker); };
    const handleOpenEditMarkerModal = (marker) => { setEditingMarker(marker); setCurrentMarkerData({ description: marker.description, icon: marker.icon || 'MapPin' }); setMarkerCoords({ x: marker.x, y: marker.y }); setIsMarkerModalOpen(true); setViewingMarker(null); };
    const handleSaveMarker = async () => { if (!db || !selectedMap) { addToast("Erro: Mapa não selecionado ou DB indisponível.", "error"); return; } if (!currentMarkerData.description.trim()) { addToast("Descrição do marcador é obrigatória.", "error"); return; } let updatedMarkers; if (editingMarker) { updatedMarkers = selectedMap.markers.map(m =>  m.id === editingMarker.id ? { ...m, description: currentMarkerData.description, icon: currentMarkerData.icon || 'MapPin' } : m ); addToast("Marcador atualizado!", "success"); } else { const newMarker = { id: `marker_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, x: markerCoords.x, y: markerCoords.y, description: currentMarkerData.description, icon: currentMarkerData.icon || 'MapPin' }; updatedMarkers = [...(selectedMap.markers || []), newMarker]; addToast("Marcador adicionado!", "success"); } try { await db.collection(mapsCollectionPath).doc(selectedMap.id).update({ markers: updatedMarkers }); setSelectedMap(prev => ({ ...prev, markers: updatedMarkers })); setIsMarkerModalOpen(false); setEditingMarker(null); } catch (error) { console.error("Erro ao salvar marcador: ", error); addToast("Erro ao salvar marcador: " + error.message, "error"); } };
    const handleDeleteMarkerRequest = (marker) => { setMarkerToDelete(marker); setShowDeleteMarkerConfirmModal(true); };
    const confirmDeleteMarker = async () => { if (!db || !selectedMap || !markerToDelete) { addToast("Erro ao preparar deleção do marcador.", "error"); return; } const updatedMarkers = selectedMap.markers.filter(m => m.id !== markerToDelete.id); try { await db.collection(mapsCollectionPath).doc(selectedMap.id).update({ markers: updatedMarkers }); addToast("Marcador deletado!", "success"); setSelectedMap(prev => ({ ...prev, markers: updatedMarkers })); } catch (error) { console.error("Erro ao deletar marcador: ", error); addToast("Erro ao deletar marcador: " + error.message, "error"); } finally { setShowDeleteMarkerConfirmModal(false); setMarkerToDelete(null); if(viewingMarker && viewingMarker.id === markerToDelete.id) setViewingMarker(null); } };

    const toggleFogCell = async (rowIndex, colIndex) => {
        if (!selectedMap || !selectedMap.fogOfWar || !userId) return;
        const currentRevealed = selectedMap.fogOfWar.revealedCells || [];
        let newRevealedCells;
        
        const isRevealed = currentRevealed.some(cell => cell.row === rowIndex && cell.col === colIndex);

        if (isRevealed) {
            newRevealedCells = currentRevealed.filter(cell => !(cell.row === rowIndex && cell.col === colIndex));
        } else {
            newRevealedCells = [...currentRevealed, {row: rowIndex, col: colIndex}];
        }
        
        const updatedMapData = { ...selectedMap.fogOfWar, revealedCells: newRevealedCells };
        setSelectedMap(prev => ({ ...prev, fogOfWar: updatedMapData }));

        try {
            await db.collection(mapsCollectionPath).doc(selectedMap.id).update({
                "fogOfWar.revealedCells": newRevealedCells,
                updatedAt: serverTimestampGlobal()
            });
        } catch (error) {
            console.error("Erro ao atualizar névoa: ", error);
            addToast("Erro ao atualizar névoa: " + error.message, "error");
            setSelectedMap(prev => ({...prev, fogOfWar: {...prev.fogOfWar, revealedCells: currentRevealed}}));
        }
    };


    return ( <div className="space-y-6"> <div className="flex justify-between items-center"> <h1 className="text-3xl font-bold text-sky-400 flex items-center"><Icon name="MapIcon" size={32} className="mr-3" />Gerenciador de Mapas</h1> <button onClick={handleOpenNewMapModal} className="bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-4 rounded-md flex items-center transition-colors"> <Icon name="PlusCircle" size={20} className="mr-2" /> Novo Mapa </button> </div> {isLoading && <p className="text-gray-400">Carregando mapas...</p>} {!isLoading && maps.length === 0 && <p className="text-gray-400 text-center py-8">Nenhum mapa adicionado ainda.</p>} {!isLoading && maps.length > 0 && !selectedMap && ( <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"> {maps.map(map => ( <div key={map.id} className="bg-gray-700 p-4 rounded-lg shadow hover:shadow-sky-500/30 transition-shadow"> <div className="flex justify-between items-start mb-2"> <h2 className="text-xl font-semibold text-sky-300 truncate" title={map.name}>{map.name}</h2> <div className="flex gap-2"> <button onClick={() => handleOpenEditMapModal(map)} className="p-1 text-gray-400 hover:text-yellow-400" title="Editar Mapa"><Icon name="Edit3" size={16}/></button> <button onClick={() => handleDeleteMapRequest(map)} className="p-1 text-gray-400 hover:text-red-500" title="Deletar Mapa"><Icon name="Trash2" size={16}/></button> </div> </div> <p className="text-sm text-gray-400 truncate mb-1" title={map.description || "Sem descrição"}>{map.description || "Sem descrição"}</p> {map.imageUrl && <img src={map.imageUrl} alt={`Prévia de ${map.name}`} className="w-full h-32 object-cover rounded-md mb-3 opacity-70" onError={(e) => e.target.style.display='none'}/>} <button onClick={() => setSelectedMap(map)} className="w-full bg-sky-700 hover:bg-sky-800 text-white py-2 px-3 rounded-md text-sm flex items-center justify-center"> <Icon name="ExternalLink" size={16} className="mr-2"/> Abrir Mapa </button> </div> ))} </div> )} 
        {selectedMap && (
        <div className="bg-gray-800 p-2 sm:p-4 rounded-lg shadow-xl">
            <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
                <h2 className="text-2xl font-semibold text-sky-300">{selectedMap.name}</h2>
                <div className="flex gap-2">
                    {selectedMap.fogOfWar?.enabled && userId && (
                        <button onClick={() => setEditingFog(!editingFog)} className={`text-sm py-1 px-3 rounded-md flex items-center transition-colors ${editingFog ? 'bg-yellow-500 hover:bg-yellow-600 text-white' : 'bg-gray-600 hover:bg-gray-500 text-white'}`}>
                            <Icon name="Eraser" size={14} className="mr-1"/> {editingFog ? "Sair Edição Névoa" : "Editar Névoa"}
                        </button>
                    )}
                    <button onClick={() => setSelectedMap(null)} className="text-sm bg-gray-600 hover:bg-gray-500 text-white py-1 px-3 rounded-md">Voltar à Lista</button>
                </div>
            </div>
            <p className="text-sm text-gray-400 mb-4">{selectedMap.description}</p>
            {selectedMap.imageUrl && mapImageDimensions.width > 0 ? (
                <div ref={imageContainerRef} onClick={handleMapClickToAddMarker} className="relative w-full overflow-hidden bg-gray-700 rounded" style={{ paddingTop: `${(mapImageDimensions.height / mapImageDimensions.width) * 100}%`, cursor: editingFog ? 'default' : 'crosshair' }}>
                    <img src={selectedMap.imageUrl} alt={`Mapa de ${selectedMap.name}`} className="absolute top-0 left-0 w-full h-full object-contain" onError={(e) => { e.target.style.display='none'; addToast("Falha ao carregar imagem do mapa.", "error"); }}/>
                    
                    {selectedMap.fogOfWar?.enabled && (
                        <div className="absolute top-0 left-0 w-full h-full grid" style={{gridTemplateColumns: `repeat(${selectedMap.fogOfWar.gridSize}, 1fr)`, gridTemplateRows: `repeat(${selectedMap.fogOfWar.gridSize}, 1fr)`}}>
                            {Array.from({ length: selectedMap.fogOfWar.gridSize * selectedMap.fogOfWar.gridSize }).map((_, index) => {
                                const row = Math.floor(index / selectedMap.fogOfWar.gridSize);
                                const col = index % selectedMap.fogOfWar.gridSize;
                                const isRevealed = selectedMap.fogOfWar.revealedCells?.some(cell => cell.row === row && cell.col === col);
                                return (
                                    <div 
                                        key={`${row}-${col}`} 
                                        className={`border border-gray-900/20 ${!isRevealed ? 'bg-black/70' : 'bg-transparent'} ${editingFog ? 'hover:bg-white/20 cursor-pointer' : ''}`}
                                        onClick={(e) => {
                                            if (editingFog) {
                                                e.stopPropagation(); 
                                                toggleFogCell(row, col);
                                            }
                                        }}
                                    ></div>
                                );
                            })}
                        </div>
                    )}

                    {(selectedMap.markers || []).map(marker => ( <div key={marker.id} className="absolute transform -translate-x-1/2 -translate-y-1/2 p-1 rounded-full cursor-pointer group" style={{ left: `${marker.x}%`, top: `${marker.y}%` }} onClick={(e) => { e.stopPropagation(); handleOpenViewMarkerModal(marker);}} title={marker.description} > <Icon name={marker.icon || 'MapPin'} size={20} className="text-red-500 group-hover:text-red-400 group-hover:scale-125 transition-all" /> </div> ))}
                </div>
            ) : ( <div className="w-full h-64 flex items-center justify-center bg-gray-700 rounded text-gray-500"> {selectedMap.imageUrl ? "Carregando imagem do mapa..." : "URL da imagem não fornecida ou inválida."} </div> )}
            {!editingFog && <p className="text-xs text-gray-500 mt-2 text-center">Clique no mapa para adicionar um novo marcador.</p>}
            {editingFog && <p className="text-xs text-yellow-400 mt-2 text-center">Modo Edição de Névoa: Clique nas células para revelar/cobrir.</p>}
        </div>
    )}
    <Modal isOpen={isMapModalOpen} onClose={() => {setIsMapModalOpen(false); setMapImageFile(null);}} title={editingMap ? "Editar Mapa" : "Adicionar Novo Mapa"} size="lg">
        <div className="space-y-4">
            <input type="text" placeholder="Nome do Mapa" value={currentMapData.name} onChange={e => setCurrentMapData({...currentMapData, name: e.target.value})} className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-sky-500" />
            <textarea placeholder="Descrição do Mapa (opcional)" value={currentMapData.description} onChange={e => setCurrentMapData({...currentMapData, description: e.target.value})} rows="3" className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-sky-500 custom-scrollbar"></textarea>
            <input type="url" placeholder="URL da Imagem do Mapa" value={currentMapData.imageUrl} onChange={e => {setCurrentMapData({...currentMapData, imageUrl: e.target.value }); setMapImageFile(null);}} className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-sky-500" disabled={!!mapImageFile} />
            {storageGlobal && <>
                <div className="text-sm text-gray-400 text-center my-1">OU</div>
                <label className="block">
                    <span className="text-gray-300 text-sm">Upload de Imagem do Mapa:</span>
                    <input type="file" accept="image/*" onChange={handleMapFileChange} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100 mt-1"/>
                </label>
                {mapImageFile && <p className="text-xs text-sky-400">Arquivo selecionado: {mapImageFile.name}</p>}
            </>}

            <div className="flex items-center space-x-3">
                <input type="checkbox" id="fogEnabled" checked={currentMapData.fogOfWar.enabled} onChange={e => setCurrentMapData({...currentMapData, fogOfWar: {...currentMapData.fogOfWar, enabled: e.target.checked}})} className="h-4 w-4 text-sky-600 border-gray-500 rounded focus:ring-sky-500"/>
                <label htmlFor="fogEnabled" className="text-sm text-gray-300">Habilitar Névoa de Guerra</label>
            </div>
            {currentMapData.fogOfWar.enabled && (
                <div className="ml-7">
                    <label htmlFor="gridSize" className="text-sm text-gray-400 block mb-1">Tamanho da Grade (ex: 10 para 10x10):</label>
                    <input type="number" id="gridSize" min="2" max="50" value={currentMapData.fogOfWar.gridSize} onChange={e => setCurrentMapData({...currentMapData, fogOfWar: {...currentMapData.fogOfWar, gridSize: parseInt(e.target.value,10) || 10 }})} className="w-24 p-2 bg-gray-600 border border-gray-500 rounded-md text-white focus:ring-2 focus:ring-sky-500"/>
                </div>
            )}
            <button onClick={handleSaveMap} disabled={isUploadingMapImage} className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 px-4 rounded-md transition-colors flex items-center justify-center disabled:opacity-50"> 
                {isUploadingMapImage ? <Icon name="UploadCloud" className="animate-ping mr-2" /> : <Icon name="FileText" size={20} className="mr-2" />}
                {isUploadingMapImage ? "Enviando Imagem..." : (editingMap ? "Salvar Alterações" : "Adicionar Mapa")}
            </button>
        </div>
    </Modal>
    <Modal isOpen={isMarkerModalOpen} onClose={() => {setIsMarkerModalOpen(false); setEditingMarker(null);}} title={editingMarker ? "Editar Marcador" : "Adicionar Novo Marcador"} size="md"> <div className="space-y-4"> {!editingMarker && <p className="text-sm text-gray-400">Coordenadas: X: {markerCoords.x}%, Y: {markerCoords.y}%</p>} <textarea placeholder="Descrição do Marcador" value={currentMarkerData.description} onChange={e => setCurrentMarkerData({...currentMarkerData, description: e.target.value})} rows="3" className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-sky-500 custom-scrollbar"></textarea> <button onClick={handleSaveMarker} className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 px-4 rounded-md transition-colors flex items-center justify-center"> <Icon name="MapPin" size={20} className="mr-2" /> {editingMarker ? "Salvar Alterações" : "Adicionar Marcador"} </button> </div> </Modal> {viewingMarker && ( <Modal isOpen={!!viewingMarker} onClose={() => setViewingMarker(null)} title={`Marcador: ${viewingMarker.description.substring(0,30)}${viewingMarker.description.length > 30 ? '...' : ''}`} size="md"> <div className="space-y-4"> <p className="text-gray-300 whitespace-pre-wrap break-words">{viewingMarker.description}</p> <p className="text-xs text-gray-500">Ícone: {viewingMarker.icon || 'MapPin'} | Coords: X: {viewingMarker.x}%, Y: {viewingMarker.y}%</p> <div className="flex justify-end gap-3 mt-4"> <button onClick={() => { setViewingMarker(null); handleDeleteMarkerRequest(viewingMarker); }} className="px-3 py-1 bg-red-700 hover:bg-red-800 text-white rounded-md text-sm flex items-center"><Icon name="Trash2" size={14} className="mr-1"/> Deletar</button> <button onClick={() => { handleOpenEditMarkerModal(viewingMarker); }} className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md text-sm flex items-center"><Icon name="Edit" size={14} className="mr-1"/> Editar</button> <button onClick={() => setViewingMarker(null)} className="px-3 py-1 bg-gray-600 hover:bg-gray-500 text-white rounded-md text-sm">Fechar</button> </div> </div> </Modal> )} <Modal isOpen={showDeleteMapConfirmModal} onClose={() => { setShowDeleteMapConfirmModal(false); setMapToDelete(null); }} title="Confirmar Deleção de Mapa" size="sm"> <p className="mb-6">Tem certeza que deseja deletar o mapa <strong className="text-sky-400">{mapToDelete?.name}</strong> e todos os seus marcadores? Esta ação não pode ser desfeita.</p> <div className="flex justify-end gap-3"> <button onClick={() => { setShowDeleteMapConfirmModal(false); setMapToDelete(null); }} className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-md transition-colors">Cancelar</button> <button onClick={confirmDeleteMap} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors">Deletar Mapa</button> </div> </Modal> <Modal isOpen={showDeleteMarkerConfirmModal} onClose={() => { setShowDeleteMarkerConfirmModal(false); setMarkerToDelete(null); }} title="Confirmar Deleção de Marcador" size="sm"> <p className="mb-6">Tem certeza que deseja deletar o marcador <strong className="text-sky-400 truncate">{markerToDelete?.description.substring(0,50)}...</strong>?</p> <div className="flex justify-end gap-3"> <button onClick={() => { setShowDeleteMarkerConfirmModal(false); setMarkerToDelete(null); }} className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-md transition-colors">Cancelar</button> <button onClick={confirmDeleteMarker} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors">Deletar Marcador</button> </div> </Modal>
        </div>
    );
};

// Componente para Gerenciador de Iniciativa
const IniciativaScreen = ({ addToast, db, userId, appId }) => { 
    const [combatants, setCombatants] = useState([]);
    const [nameInput, setNameInput] = useState('');
    const [initiativeInput, setInitiativeInput] = useState('');
    const [hpInput, setHpInput] = useState(''); 
    const [acInput, setAcInput] = useState(''); 
    const [conditionsInput, setConditionsInput] = useState('');

    const [currentTurnIndex, setCurrentTurnIndex] = useState(0);
    const [roundCount, setRoundCount] = useState(1);
    const [isLoading, setIsLoading] = useState(true); 
    const [isSaving, setIsSaving] = useState(false);

    const [isEditCombatantModalOpen, setIsEditCombatantModalOpen] = useState(false);
    const [editingCombatant, setEditingCombatant] = useState(null); 
    const [editedCombatantData, setEditedCombatantData] = useState({ name: '', initiative: '', hp: '', ac: '', conditions: ''});

    const [editingHpId, setEditingHpId] = useState(null); 
    const [inlineHpValue, setInlineHpValue] = useState('');


    const initiativeTrackerDocPath = `artifacts/${appId}/users/${userId}/initiativeTracker/current`;

    useEffect(() => {
        if (!db || !userId) {
            setIsLoading(false);
            setCombatants([]); setCurrentTurnIndex(0); setRoundCount(1); 
            return;
        }
        setIsLoading(true);
        const docRef = db.doc(initiativeTrackerDocPath);
        const unsubscribe = docRef.onSnapshot(docSnapshot => {
            if (docSnapshot.exists) {
                const data = docSnapshot.data();
                setCombatants(data.combatants || []);
                setCurrentTurnIndex(data.currentTurnIndex || 0);
                setRoundCount(data.roundCount || 1);
            } else {
                setCombatants([]); setCurrentTurnIndex(0); setRoundCount(1);
            }
            setIsLoading(false);
        }, error => {
            console.error("Erro ao carregar dados de iniciativa: ", error);
            addToast("Erro ao carregar dados de iniciativa: " + error.message, "error");
            setIsLoading(false);
        });
        return () => unsubscribe();
    }, [db, userId, appId, initiativeTrackerDocPath, addToast]);

    const saveInitiativeState = useCallback(async (newCombatants, newTurnIndex, newRoundCount) => {
        if (!db || !userId ) return; 
        if (isSaving) return; 
        setIsSaving(true);
        const stateToSave = {
            combatants: newCombatants,
            currentTurnIndex: newTurnIndex,
            roundCount: newRoundCount,
            updatedAt: serverTimestampGlobal()
        };
        try {
            await db.doc(initiativeTrackerDocPath).set(stateToSave, { merge: true });
        } catch (error) {
            console.error("Erro ao salvar estado da iniciativa: ", error);
            addToast("Erro ao salvar estado da iniciativa: " + error.message, "error");
        } finally {
            setIsSaving(false);
        }
    }, [db, userId, appId, initiativeTrackerDocPath, addToast, isSaving]);


    const addCombatant = () => {
        if (!nameInput.trim() || !initiativeInput.trim()) { addToast("Nome e Iniciativa são obrigatórios.", "error"); return; }
        const initiativeValue = parseInt(initiativeInput, 10);
        const hpValue = hpInput.trim() === '' ? null : parseInt(hpInput, 10);
        const acValue = acInput.trim() === '' ? null : parseInt(acInput, 10);

        if (isNaN(initiativeValue)) { addToast("Iniciativa deve ser um número.", "error"); return; }
        if (hpInput.trim() !== '' && isNaN(hpValue)) { addToast("HP deve ser um número ou vazio.", "error"); return; }
        if (acInput.trim() !== '' && isNaN(acValue)) { addToast("AC deve ser um número ou vazio.", "error"); return; }

        const newCombatant = { 
            id: `combatant_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, 
            name: nameInput, 
            initiative: initiativeValue,
            hp: hpValue,
            ac: acValue,
            conditions: conditionsInput.trim() || ''
        };
        const updatedCombatants = [...combatants, newCombatant].sort((a, b) => b.initiative - a.initiative);
        
        setCombatants(updatedCombatants); 
        if (userId) saveInitiativeState(updatedCombatants, currentTurnIndex, roundCount);

        setNameInput(''); setInitiativeInput(''); setHpInput(''); setAcInput(''); setConditionsInput('');
        addToast(`${newCombatant.name} adicionado ao combate!`, "success");
    };

    const handleOpenEditCombatantModal = (combatant) => {
        setEditingCombatant(combatant);
        setEditedCombatantData({
            name: combatant.name,
            initiative: combatant.initiative.toString(),
            hp: combatant.hp === null || combatant.hp === undefined ? '' : combatant.hp.toString(),
            ac: combatant.ac === null || combatant.ac === undefined ? '' : combatant.ac.toString(),
            conditions: combatant.conditions || ''
        });
        setIsEditCombatantModalOpen(true);
    };

    const handleSaveEditedCombatant = () => {
        if (!editingCombatant) return;
        if (!editedCombatantData.name.trim() || !editedCombatantData.initiative.trim()) {
            addToast("Nome e Iniciativa são obrigatórios.", "error"); return;
        }
        const initiativeValue = parseInt(editedCombatantData.initiative, 10);
        const hpValue = editedCombatantData.hp.trim() === '' ? null : parseInt(editedCombatantData.hp, 10);
        const acValue = editedCombatantData.ac.trim() === '' ? null : parseInt(editedCombatantData.ac, 10);

        if (isNaN(initiativeValue)) { addToast("Iniciativa deve ser um número.", "error"); return; }
        if (editedCombatantData.hp.trim() !== '' && isNaN(hpValue)) { addToast("HP deve ser um número ou vazio.", "error"); return; }
        if (editedCombatantData.ac.trim() !== '' && isNaN(acValue)) { addToast("AC deve ser um número ou vazio.", "error"); return; }

        const updatedCombatants = combatants.map(c => 
            c.id === editingCombatant.id 
            ? { ...c, 
                name: editedCombatantData.name, 
                initiative: initiativeValue,
                hp: hpValue,
                ac: acValue,
                conditions: editedCombatantData.conditions.trim() || ''
              } 
            : c
        ).sort((a, b) => b.initiative - a.initiative); 

        setCombatants(updatedCombatants);
        if (userId) saveInitiativeState(updatedCombatants, currentTurnIndex, roundCount);
        
        setIsEditCombatantModalOpen(false);
        setEditingCombatant(null);
        addToast(`${editedCombatantData.name} atualizado!`, "success");
    };

    const handleHpChange = (combatantId, newHp) => {
        const hpValue = newHp.trim() === '' ? null : parseInt(newHp, 10);
        if (newHp.trim() !== '' && isNaN(hpValue)) {
            addToast("HP deve ser um número ou vazio.", "error");
            const combatant = combatants.find(c => c.id === combatantId);
            setInlineHpValue(combatant.hp === null || combatant.hp === undefined ? '' : combatant.hp.toString()); 
            return;
        }

        const updatedCombatants = combatants.map(c => 
            c.id === combatantId ? { ...c, hp: hpValue } : c
        );
        setCombatants(updatedCombatants);
        if (userId) saveInitiativeState(updatedCombatants, currentTurnIndex, roundCount);
        setEditingHpId(null); 
    };
    
    const startEditingHp = (combatant) => {
        setEditingHpId(combatant.id);
        setInlineHpValue(combatant.hp === null || combatant.hp === undefined ? '' : combatant.hp.toString());
    };


    const removeCombatant = (idToRemove) => {
        let newTurnIndex = currentTurnIndex;
        const updatedCombatants = combatants.filter(c => c.id !== idToRemove);
        let newRoundCount = roundCount;
        
        if (newTurnIndex >= updatedCombatants.length && updatedCombatants.length > 0) {
            newTurnIndex = updatedCombatants.length - 1;
        } else if (updatedCombatants.length === 0) {
            newTurnIndex = 0;
            newRoundCount = 1; 
        }
        
        setCombatants(updatedCombatants);
        setCurrentTurnIndex(newTurnIndex);
        setRoundCount(newRoundCount);
        if (userId) saveInitiativeState(updatedCombatants, newTurnIndex, newRoundCount);
        addToast("Combatente removido.", "info");
    };

    const nextTurn = () => {
        if (combatants.length === 0) return;
        let newRoundCount = roundCount;
        const newTurnIndex = (currentTurnIndex + 1) % combatants.length;
        if (newTurnIndex === 0) {
            newRoundCount = roundCount + 1;
            addToast(`Nova Rodada: ${newRoundCount}!`, "info");
        }
        setCurrentTurnIndex(newTurnIndex);
        setRoundCount(newRoundCount);
        if (userId) saveInitiativeState(combatants, newTurnIndex, newRoundCount);
    };
    
    const prevTurn = () => {
        if (combatants.length === 0) return;
        let newRoundCount = roundCount;
        const newTurnIndex = (currentTurnIndex - 1 + combatants.length) % combatants.length;
         if (currentTurnIndex === 0 && newTurnIndex === combatants.length -1 && roundCount > 1) {
            newRoundCount = roundCount - 1;
            addToast(`Retornando para Rodada: ${newRoundCount}.`, "info");
        }
        setCurrentTurnIndex(newTurnIndex);
        setRoundCount(newRoundCount);
        if (userId) saveInitiativeState(combatants, newTurnIndex, newRoundCount);
    };
    
    const resetTracker = () => {
        const emptyCombatants = [];
        const initialTurnIndex = 0;
        const initialRoundCount = 1;
        setCombatants(emptyCombatants);
        setCurrentTurnIndex(initialTurnIndex);
        setRoundCount(initialRoundCount);
        setNameInput(''); setInitiativeInput(''); setHpInput(''); setAcInput(''); setConditionsInput('');
        if (userId) saveInitiativeState(emptyCombatants, initialTurnIndex, initialRoundCount);
        addToast("Gerenciador de Iniciativa resetado.", "info");
    };

    if (isLoading && userId) { 
        return <div className="flex justify-center items-center h-40"><p className="text-sky-400">Carregando iniciativa...</p></div>;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-sky-400 flex items-center"><Icon name="ListOrdered" size={32} className="mr-3" />Gerenciador de Iniciativa</h1>
            
            <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
                <h2 className="text-xl font-semibold text-sky-300 mb-4">Adicionar Combatente</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    <input type="text" placeholder="Nome do Combatente" value={nameInput} onChange={e => setNameInput(e.target.value)} className="p-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-sky-500"/>
                    <input type="number" placeholder="Iniciativa" value={initiativeInput} onChange={e => setInitiativeInput(e.target.value)} className="p-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-sky-500"/>
                    <input type="number" placeholder="HP (opcional)" value={hpInput} onChange={e => setHpInput(e.target.value)} className="p-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-sky-500"/>
                    <input type="number" placeholder="AC (opcional)" value={acInput} onChange={e => setAcInput(e.target.value)} className="p-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-sky-500"/>
                    <input type="text" placeholder="Condições (opcional)" value={conditionsInput} onChange={e => setConditionsInput(e.target.value)} className="md:col-span-2 lg:col-span-3 p-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-sky-500"/>
                </div>
                <button onClick={addCombatant} disabled={isSaving} className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-md transition-colors flex items-center justify-center disabled:opacity-50">
                    <Icon name="UserPlus" size={20} className="mr-2" /> Adicionar Combatente
                </button>
            </div>

            {combatants.length > 0 && (
                <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-sky-300">Ordem de Combate (Rodada: {roundCount})</h2>
                        <div className="flex gap-2 items-center">
                            {isSaving && <Icon name="Save" size={16} className="text-sky-400 animate-spin" title="Salvando..."/>}
                            <button onClick={resetTracker} disabled={isSaving} className="text-sm bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded-md flex items-center disabled:opacity-50">
                                <Icon name="Trash2" size={14} className="mr-1"/> Resetar
                            </button>
                        </div>
                    </div>
                    <ul className="space-y-3 mb-6 max-h-[50vh] overflow-y-auto custom-scrollbar pr-2">
                        {combatants.map((c, index) => (
                            <li key={c.id} className={`p-4 rounded-md transition-all duration-300 ease-in-out ${index === currentTurnIndex ? 'bg-sky-600 shadow-lg scale-105' : 'bg-gray-700 hover:bg-gray-600'}`}>
                                <div className="flex justify-between items-center">
                                    <div className="flex-grow flex items-center overflow-hidden">
                                        <span className={`font-bold text-lg mr-3 ${index === currentTurnIndex ? 'text-white' : 'text-sky-400'}`}>{c.initiative}</span>
                                        <span className={`text-lg truncate ${index === currentTurnIndex ? 'text-white font-semibold' : 'text-gray-200'}`} title={c.name}>{c.name}</span>
                                        {(c.hp !== null && c.hp !== undefined) && (
                                            editingHpId === c.id ? (
                                                <input 
                                                    type="number"
                                                    value={inlineHpValue}
                                                    onChange={(e) => setInlineHpValue(e.target.value)}
                                                    onBlur={() => handleHpChange(c.id, inlineHpValue)}
                                                    onKeyDown={(e) => e.key === 'Enter' && handleHpChange(c.id, inlineHpValue)}
                                                    className={`ml-2 w-16 p-1 text-xs rounded bg-gray-800 text-white border ${index === currentTurnIndex ? 'border-sky-300' : 'border-gray-600'} focus:ring-1 focus:ring-sky-400`}
                                                    autoFocus
                                                />
                                            ) : (
                                                <span onClick={() => startEditingHp(c)} className={`ml-3 text-xs flex items-center cursor-pointer ${index === currentTurnIndex ? 'text-sky-200 hover:text-white' : 'text-gray-400 hover:text-sky-300'}`}><Icon name="HeartPulse" size={14} className="mr-1"/> {c.hp}</span>
                                            )
                                        )}
                                        {(c.ac !== null && c.ac !== undefined) && <span className={`ml-3 text-xs flex items-center ${index === currentTurnIndex ? 'text-sky-200' : 'text-gray-400'}`}><Icon name="ShieldAlert" size={14} className="mr-1"/> {c.ac}</span>}
                                    </div>
                                    <div className="flex-shrink-0 flex items-center gap-2 ml-2">
                                        <button onClick={() => handleOpenEditCombatantModal(c)} disabled={isSaving} className={`p-1 rounded-full ${index === currentTurnIndex ? 'text-sky-200 hover:text-white hover:bg-sky-700' : 'text-gray-400 hover:text-yellow-400 hover:bg-gray-600'} disabled:opacity-50`} title="Editar Combatente">
                                            <Icon name="Edit3" size={16} />
                                        </button>
                                        <button onClick={() => removeCombatant(c.id)} disabled={isSaving} className={`p-1 rounded-full ${index === currentTurnIndex ? 'text-sky-200 hover:text-white hover:bg-sky-700' : 'text-gray-400 hover:text-red-500 hover:bg-gray-600'} disabled:opacity-50`} title="Remover Combatente">
                                            <Icon name="Trash2" size={16} />
                                        </button>
                                    </div>
                                </div>
                                {c.conditions && (
                                    <div className={`mt-2 text-xs italic ${index === currentTurnIndex ? 'text-sky-100' : 'text-gray-400'}`}>
                                        Condições: {c.conditions}
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                    <div className="flex justify-center gap-4">
                        <button onClick={prevTurn} disabled={isSaving || combatants.length === 0} className="bg-gray-600 hover:bg-gray-500 text-white font-semibold py-3 px-6 rounded-md flex items-center transition-colors disabled:opacity-50">
                            <Icon name="ArrowLeftCircle" size={20} className="mr-2"/> Anterior
                        </button>
                        <button onClick={nextTurn} disabled={isSaving || combatants.length === 0} className="bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 px-6 rounded-md flex items-center transition-colors disabled:opacity-50">
                            Próximo <Icon name="ArrowRightCircle" size={20} className="ml-2"/>
                        </button>
                    </div>
                </div>
            )}
             {combatants.length === 0 && !isLoading && ( 
                <p className="text-gray-400 text-center py-8">Nenhum combatente na lista. Adicione alguns para começar!</p>
            )}

            <Modal isOpen={isEditCombatantModalOpen} onClose={() => setIsEditCombatantModalOpen(false)} title="Editar Combatente" size="lg">
                <div className="space-y-4">
                    <input type="text" placeholder="Nome do Combatente" value={editedCombatantData.name} onChange={e => setEditedCombatantData({...editedCombatantData, name: e.target.value})} className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-sky-500"/>
                    <input type="number" placeholder="Iniciativa" value={editedCombatantData.initiative} onChange={e => setEditedCombatantData({...editedCombatantData, initiative: e.target.value})} className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-sky-500"/>
                    <input type="number" placeholder="HP (opcional)" value={editedCombatantData.hp} onChange={e => setEditedCombatantData({...editedCombatantData, hp: e.target.value})} className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-sky-500"/>
                    <input type="number" placeholder="AC (opcional)" value={editedCombatantData.ac} onChange={e => setEditedCombatantData({...editedCombatantData, ac: e.target.value})} className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-sky-500"/>
                    <input type="text" placeholder="Condições (opcional)" value={editedCombatantData.conditions} onChange={e => setEditedCombatantData({...editedCombatantData, conditions: e.target.value})} className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-sky-500"/>
                    <button onClick={handleSaveEditedCombatant} disabled={isSaving} className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 px-4 rounded-md transition-colors flex items-center justify-center disabled:opacity-50">
                        <Icon name="Save" size={20} className="mr-2" /> Salvar Alterações
                    </button>
                </div>
            </Modal>
        </div>
    );
};


// Componente Principal do App
const App = () => {
    const [currentPage, setCurrentPage] = useState('dashboard'); const [db, setDb] = useState(null); const [auth, setAuth] = useState(null); const [userId, setUserId] = useState(null); const [isAuthReady, setIsAuthReady] = useState(false); const [isSidebarOpen, setIsSidebarOpen] = useState(false); const [toast, setToast] = useState({ message: '', type: '', key: 0 });
    const addToast = useCallback((message, type = 'info') => { setToast({ message, type, key: Date.now() }); setTimeout(() => { setToast(prev => prev.message === message ? { message: '', type: '', key: 0 } : prev); }, 5000); }, []);
    useEffect(() => { setDb(dbGlobal); setAuth(authGlobal); const unsubscribe = authGlobal.onAuthStateChanged(async (user) => { if (user) { setUserId(user.uid); if (!isAuthReady) { addToast(`Autenticado como: ${user.uid.substring(0,8)}...`, 'success');} } else { try { if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) { await authGlobal.signInWithCustomToken(__initial_auth_token); addToast("Login com token customizado bem-sucedido.", 'success'); } else { await authGlobal.signInAnonymously(); addToast("Login anônimo realizado.", 'info'); } } catch (error) { console.error("Erro na autenticação:", error); addToast("Falha na autenticação: " + error.message, "error"); setUserId(null); } } setIsAuthReady(true); }); return () => unsubscribe(); }, [addToast, isAuthReady]);
    const NavLink = ({ page, icon, children }) => { const IconComponent = iconMap[icon] || iconMap.ImageIcon; return ( <button onClick={() => { setCurrentPage(page); setIsSidebarOpen(false); }} className={`flex items-center w-full px-4 py-3 text-left text-sm rounded-md transition-colors duration-150 ${currentPage === page ? 'bg-sky-600 text-white shadow-lg' : 'text-gray-300 hover:bg-gray-700 hover:text-sky-300'}`}> <IconComponent size={20} className="mr-3 flex-shrink-0" /> <span className="flex-grow">{children}</span> </button> ); };
    const renderPage = () => { if (!isAuthReady) return <div className="flex justify-center items-center h-full"><div className="text-sky-400 text-xl">Carregando autenticação... <Icon name="Zap" className="inline animate-ping" /></div></div>; if (!userId) return ( <div className="flex flex-col justify-center items-center h-full text-center p-4"> <Icon name="AlertTriangle" size={48} className="text-red-500 mb-4" /> <h2 className="text-2xl text-red-400 mb-2">Falha na Autenticação</h2> <p className="text-gray-300">Não foi possível autenticar. Verifique sua conexão e configurações.</p> <p className="text-xs text-gray-500 mt-2">App ID: {appId}</p> <button onClick={async () => { setIsAuthReady(false); try { if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) await authGlobal.signInWithCustomToken(__initial_auth_token); else await authGlobal.signInAnonymously(); } catch (e) {/* handled by onAuthStateChanged */} }} className="mt-4 bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-4 rounded-md">Tentar Novamente</button> </div> );
        switch (currentPage) {
            case 'dashboard': return <DashboardScreen setCurrentPage={setCurrentPage} addToast={addToast} userId={userId} />;
            case 'fichas': return <FichasScreen addToast={addToast} db={db} userId={userId} appId={appId} />;
            case 'campanha': return <CampanhaScreen addToast={addToast} db={db} userId={userId} appId={appId} />;
            case 'mapas': return <MapasScreen addToast={addToast} db={db} userId={userId} appId={appId} />;
            case 'dados': return <DiceRoller addToast={addToast} />;
            case 'iniciativa': return <IniciativaScreen addToast={addToast} db={db} userId={userId} appId={appId} />; 
            default: return <DashboardScreen setCurrentPage={setCurrentPage} addToast={addToast} userId={userId} />;
        }
    };
    const DashboardScreen = ({setCurrentPage, addToast, userId}) => ( <div className="space-y-8"> <div className="bg-gray-800 p-8 rounded-lg shadow-2xl text-center"> <Icon name="ShieldCheck" size={64} className="mx-auto text-sky-400 mb-6 animate-pulse" /> <h1 className="text-4xl font-bold text-sky-300 mb-3">Bem-vindo ao Nexus RPG!</h1> <p className="text-lg text-gray-300 mb-6">Sua central completa para gerenciar suas aventuras de RPG.</p> <div className="flex flex-wrap justify-center gap-4"> <button onClick={() => setCurrentPage('fichas')} className="bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-5 rounded-md flex items-center transition-colors"><Icon name="Users" size={18} className="mr-2"/>Gerenciar Fichas</button> <button onClick={() => setCurrentPage('dados')} className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-5 rounded-md flex items-center transition-colors"><Icon name="Dices" size={18} className="mr-2"/>Rolar Dados</button> <button onClick={() => setCurrentPage('campanha')} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-5 rounded-md flex items-center transition-colors"><Icon name="BookMarked" size={18} className="mr-2"/>Campanha</button> <button onClick={() => setCurrentPage('mapas')} className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-5 rounded-md flex items-center transition-colors"><Icon name="MapIcon" size={18} className="mr-2"/>Mapas</button> <button onClick={() => setCurrentPage('iniciativa')} className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-5 rounded-md flex items-center transition-colors"><Icon name="ListOrdered" size={18} className="mr-2"/>Iniciativa</button> </div> </div> <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> {[ { title: "Fichas Detalhadas", icon: "Users", page: "fichas", desc: "Crie e gerencie fichas de personagens." }, { title: "Conteúdo da Campanha", icon: "BookOpen", page: "campanha", desc: "Organize wiki, diário do mestre e mais." }, { title: "Mapas Interativos", icon: "MapIcon", page: "mapas", desc: "Explore e adicione marcadores aos mapas." }, { title: "Gerenciar Iniciativa", icon: "ListOrdered", page: "iniciativa", desc: "Controle a ordem de combate facilmente." }, { title: "Rolador de Dados", icon: "Dices", page: "dados", desc: "Rolagens rápidas e personalizadas." }, { title: "Bestiário & PNJs", icon: "Bug", page: "campanha", desc: "Consulte e crie monstros e criaturas." }, ].map(item => ( <div key={item.title} className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-sky-500/30 transition-shadow cursor-pointer" onClick={() => setCurrentPage(item.page)}> <div className="flex items-center text-sky-400 mb-3"><Icon name={item.icon} size={24} className="mr-3" /> <h2 className="text-xl font-semibold">{item.title}</h2></div> <p className="text-gray-400 text-sm">{item.desc}</p> </div> ))} </div> {userId && <div className="mt-8 p-3 bg-gray-800 rounded-md text-center text-xs text-gray-500">ID do Usuário: <strong className="text-sky-400">{userId}</strong> | App ID: <strong className="text-sky-400">{appId}</strong></div>} </div> );
    return ( <div className="flex h-screen bg-gray-900 text-white font-sans"> <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-gray-800 shadow-lg transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:flex md:flex-col`}> <div className="flex items-center justify-between h-20 px-6 bg-gray-800 border-b border-gray-700"> <div className="flex items-center"><Icon name="ShieldCheck" size={32} className="text-sky-400 mr-3" /> <span className="text-2xl font-bold text-sky-400">Nexus RPG</span></div> <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-gray-400 hover:text-sky-400"><Icon name="X" size={24} /></button> </div> <nav className="flex-grow p-4 space-y-2 overflow-y-auto custom-scrollbar"> <NavLink page="dashboard" icon="Home">Painel</NavLink> <NavLink page="fichas" icon="Users">Fichas</NavLink> <NavLink page="campanha" icon="BookOpen">Campanha</NavLink> <NavLink page="mapas" icon="MapIcon">Mapas</NavLink> <NavLink page="iniciativa" icon="ListOrdered">Iniciativa</NavLink> <NavLink page="dados" icon="Dices">Dados</NavLink> </nav> <div className="p-4 border-t border-gray-700"> {isAuthReady && userId && (<div className="text-xs text-gray-500 mb-2"><p>ID Usuário: <span className="font-mono text-sky-500 block truncate" title={userId}>{userId}</span></p><p>App ID: <span className="font-mono text-sky-500 block truncate" title={appId}>{appId}</span></p></div>)} <button onClick={() => { if (authGlobal.currentUser) { authGlobal.signOut(); addToast("Você foi desconectado.", "info"); setUserId(null); setIsAuthReady(false); } else { addToast("Nenhum usuário conectado.", "info");}}} className="w-full flex items-center justify-center px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors" disabled={!userId && isAuthReady}> <Icon name="LogOut" size={16} className="mr-2" /> Desconectar </button> </div> </aside> {isSidebarOpen && <div onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 z-20 bg-black opacity-50 md:hidden"></div>} <main className="flex-1 flex flex-col overflow-hidden"> <header className="h-20 bg-gray-800 shadow-md flex items-center justify-between px-6 border-b border-gray-700"> <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-gray-300 hover:text-sky-400 md:hidden"><Icon name="ChevronsUpDown" size={24} /></button> <h1 className="text-xl font-semibold text-sky-400 capitalize flex-grow text-center md:text-left">{currentPage.charAt(0).toUpperCase() + currentPage.slice(1)}</h1> <div className="flex items-center gap-2"><Icon name="Sun" size={20} className="text-yellow-400 hidden sm:block" /></div> </header> <div className="flex-1 p-6 overflow-y-auto bg-gray-850 custom-scrollbar">{renderPage()}</div> </main> <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: '', key: 0 })} key={toast.key} />
        <style>{`
            .custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
            .custom-scrollbar::-webkit-scrollbar-track { background: rgba(55, 65, 81, 0.5); border-radius: 10px; }
            .custom-scrollbar::-webkit-scrollbar-thumb { background: #0ea5e9; border-radius: 10px; }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #0284c7; }
            .custom-scrollbar { scrollbar-width: thin; scrollbar-color: #0ea5e9 rgba(55, 65, 81, 0.5); }
        `}</style>
    </div> );
};

export default App;
