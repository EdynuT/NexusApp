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

document.addEventListener('DOMContentLoaded', () => {
    const diceInput = document.getElementById('dice-input');
    const rollButton = document.getElementById('roll-button');
    const resultDisplay = document.getElementById('result-display');
    const rollHistory = document.getElementById('roll-history');

    rollButton.addEventListener('click', () => {
        const input = diceInput.value;
        const result = rollDice(input);
        displayResult(result);
        updateHistory(input, result);
    });

    function rollDice(input) {
        const [num, sides] = input.split('d').map(Number);
        let total = 0;
        let resultString = '';

        for (let i = 0; i < num; i++) {
            const roll = Math.floor(Math.random() * sides) + 1;
            total += roll;
            resultString += `${roll}${i < num - 1 ? ' + ' : ''}`;
        }

        return { total, resultString };
    }

    function displayResult({ total, resultString }) {
        resultDisplay.textContent = `Resultado: ${total} (${resultString})`;
    }

    function updateHistory(input, { total }) {
        const historyItem = document.createElement('li');
        historyItem.textContent = `${input} = ${total}`;
        rollHistory.appendChild(historyItem);
    }
});