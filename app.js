import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager, collection, doc, setDoc, updateDoc, deleteDoc, deleteField, getDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

/* ---------- strings ---------- */
const I18N = {
  en: {
    tagline: "Assignments and tasks, logged as quests.",
    tabQuests: "Quests", tabCal: "Calendar", tabStats: "Stats", tabHistory: "History",
    newQuest: "New quest", settings: "Settings",
    activeN: n => `${n} active`, overdueN: n => `${n} overdue`, planN: n => `${n} plan passed`,
    sortBy: "Sort", sortDue: "Due date", sortPlan: "Do-on day", sortImp: "Importance", sortDiff: "Difficulty",
    emptyTitle: "No active quests",
    emptyBody: "Add your first assignment or task. Give it a due date, pick the day you'll do it, and rate how hard and how important it is.",
    emptyFiltered: "No active quests match this filter.", noResults: q => `Nothing matches “${q}”.`,
    loading: "Loading your quests…",
    due: "Due", plan: "Do on",
    diff: "Difficulty", imp: "Importance",
    diffLabels: ["Easy", "Moderate", "Hard", "Very hard", "Brutal"],
    impLabels: ["Trivial", "Minor", "Moderate", "Important", "Critical"],
    hintSkip: "Hard but unimportant", hintWin: "Quick win",
    complete: "Complete", giveUp: "Give up", changeDates: "Change dates",
    overdueBadge: "Overdue", extended: n => n > 1 ? `Extended ×${n}` : "Extended",
    planPassedTitle: "Your planned day has passed",
    rel: n => n === 0 ? "today" : n === 1 ? "tomorrow" : n === -1 ? "yesterday" : n > 0 ? `in ${n} days` : `${-n} days ago`,
    overdueBy: n => n === 1 ? "1 day overdue" : `${n} days overdue`,
    fTitle: "Quest name", fTitlePh: "History essay", fDesc: "Description", fDescPh: "What needs to be done?",
    fDue: "Due date", fPlan: "Day you'll do it", today: "Today", tomorrow: "Tomorrow",
    save: "Save", cancel: "Cancel", addQuest: "Add quest", editTitle: "Edit quest", next: "Next",
    errTitle: "Give the quest a name.", errDue: "Pick a due date.", errPlan: "Pick the day you'll do it.",
    errPlanAfter: "The day you'll do it can't be after the due date.",
    sure: "Yes, I'm sure",
    completeQ: t => `Did you finish “${t}”?`, completeQBody: "Next you'll enter the date you finished it.",
    overdueQ: "This quest is past its due date", overdueQBody: "Did you finish it late, or did you finish on time and forget to log it?",
    optLate: "I finished it late", optForgot: "I finished on time but forgot to log it",
    whenDone: "When did you finish it?",
    errDate: "Pick a valid date.", errDateFuture: "That date is in the future.",
    errLateRange: "A late finish has to be after the due date.", errForgotRange: "An on-time finish has to be on or before the due date.",
    timingEarly: n => n === 1 ? "1 day early" : `${n} days early`, timingOntime: "On time",
    timingLate: n => n === 1 ? "1 day late" : `${n} days late`, forgotNote: "Counts as on time",
    finishedOn: "Finished", bigComplete: "COMPLETE QUEST", bigCompleteNote: "Tap to complete the quest.",
    giveUpQ: t => `Give up on “${t}”?`, giveUpQBody: "It will be logged as a failed quest, lower your success rate, and cost you XP.", keepGoing: "Keep going",
    bigGiveUp: "GIVE UP QUEST", lastChance: "Last chance. You can still finish it.",
    changeQ: t => `Change the dates of “${t}”?`, changeQBody: "You'll set a new due date and pick a new day to do it.",
    currentDue: "Current due date", currentPlan: "Current day", newDue: "New due date", newPlan: "New day you'll do it",
    saveDates: "Save dates", errNewPlan: "Pick a new day to do it.",
    deleteQuest: "Delete quest", deleteQ: t => `Delete “${t}” for good?`,
    deleteQBody: "It disappears from your list and your stats. This can't be undone.", deleteYes: "Yes, delete it",
    weekLine: n => n === 1 ? "1 quest completed this week" : `${n} quests completed this week`,
    failLines: ["Make the next one count.", "Shake it off. Your next quest is waiting.", "Finish the next one and win it back."],
    successRate: p => `Success rate: ${p}%`,
    continue: "Continue",
    thisWeek: "This week", thisMonth: "This month", thisYear: "This year", allTime: "All time",
    completedWord: "completed",
    timingTitle: "How you finish", timingSub: "Completed quests compared with their due date",
    early: "Early", ontime: "On time", late: "Late",
    statusTitle: "All quests", statusSubAll: "Every quest you've entered", statusSubPeriod: "Quests you entered in this period",
    sDone: "Completed", sFailed: "Failed", sActive: "Still open", questsWord: "quests",
    noData: "Nothing here yet for this period.",
    rateLine: (p, f) => `Success rate <strong>${p}%</strong> · ${f} failed in this period`,
    hAll: "All", hDone: "Completed", hFailed: "Failed",
    failedOn: "Gave up", failedPill: "Failed", forgotTag: "Logged later",
    histEmpty: "Finished and failed quests show up here.",
    syncOff: "Your quests couldn't be loaded. Check your connection, then sign out and back in.",
    privateNote: "This quest log is private to its owner.",
    saveErr: "Couldn't save. Check your connection and try again.",
    quota: "Storage is full. Delete some old quests to add new ones.",
    soundOn: "Sound on", soundOff: "Sound off",
    added: "Added", dateChanges: "Date changes", status: "Status", activeWord: "Active",
    extLine: (a, f, to) => `${a}: due ${f} → ${to}`,
    close: "Close", saved: "Saved", deleted: "Deleted",
    groupToday: "Today", groupWeek: "This week", groupLater: "Later",
    loadOf: (l, c) => `${l} of ${c} planned`, loadOnly: l => `${l} planned`,
    whatNow: "What should I do now?", suggestTitle: "Do this now", suggestStart: "On it", suggestNext: "Suggest another",
    suggestNone: "Nothing to suggest yet. Add a quest first.",
    rOverdue: "Overdue", rDueToday: "Due today", rDueTomorrow: "Due tomorrow", rDueSoon: n => `Due in ${n} days`,
    rPlanned: "Planned for today", rPlanPassed: "Planned day passed", rImportant: "Very important", rQuick: "Quick win",
    category: "Subject", noCat: "None", newCat: "New", catPh: "Math", addCat: "Add", allCats: "All", uncategorized: "No subject",
    est: "Estimated time", estHours: "hours",
    fmtMin: m => { const h = Math.floor(m / 60), r = m % 60; return h ? (r ? `${h}h ${r}m` : `${h}h`) : `${r}m`; },
    loadWarn: (day, total, cap) => `That puts ${total} of work on ${day}. Your daily limit is ${cap}.`,
    subtasks: "Subtasks", addSub: "Add", subPh: "Research sources", subProgress: (d, n) => `${d}/${n} subtasks`,
    repeat: "Repeat", rep: { none: "Never", daily: "Every day", weekly: "Every week", biweekly: "Every 2 weeks", monthly: "Every month" },
    repeatNote: "The next one appears on its own once this one is finished, given up, or past due.",
    level: n => `Level ${n}`, lvTitles: ["Apprentice", "Adventurer", "Wanderer", "Warrior", "Knight", "Hero", "Champion", "Legend", "Mythic"],
    xpOf: (a, b) => `${a} / ${b} XP`,
    streak: n => n === 1 ? "1-day streak" : `${n}-day streak`, noStreak: "No streak yet",
    totalXp: n => `${n} XP total`, bestStreak: n => `Best streak: ${n} ${n === 1 ? "day" : "days"}`,
    byCat: "By subject", byCatSub: "Completed and failed quests in this period",
    catLine: (d, lp, f) => `${d} completed · ${lp}% late · ${f} failed`,
    reopen: "Make active again", reopenQ: t => `Make “${t}” active again?`,
    reopenBody: "It goes back to your quest list and the XP from it is undone.", reopened: "Back in your list",
    capacity: "Daily limit (hours)", capacityHelp: "You'll get a warning when a day's planned work goes over this.",
    manageCats: "Subjects", noCats: "No subjects yet. Add one below.", removeCat: "Remove",
    dayFilter: d => `Only ${d}`, clear: "Clear", weekLoad: "Next 7 days",
    levelText: (n, title) => `Level ${n} · ${title}`,
    searchPh: "Search quests", searchClear: "Clear search",
    calPrev: "Previous month", calNext: "Next month", calToday: "Today",
    calDue: "Due this day", calPlanned: "Planned for this day", calDone: "Finished this day",
    calEmpty: "Nothing on this day.", calAdd: "Add a quest for this day",
    legendDue: "Due date (subject colour)", legendPlan: "Day to do it", legendDone: "Finished",
    calMonthView: "Month", calListView: "List", calMonthEmpty: "Nothing this month.",
    lblDue: "Due", lblPlan: "To do", lblDone: "Done", editBtn: "Edit",
    pkLeft: m => `${m} left`, pkDetails: "Details",
    dailyGoal: "Daily goal (quests)", dailyGoalHelp: "Finish this many quests in a day for +20 bonus XP. 0 turns it off.",
    goalLabel: "Today's goal", goalDone: "Daily goal reached · +20 XP",
    badgesTitle: "Badges", badgesSub: (a, b) => `${a} of ${b} unlocked`, badgeEarned: d => `Unlocked ${d}`, badgesChip: (a, b) => `${a}/${b}`,
    summaryTitle: "Your last week", summaryBtn: "Last week's summary",
    sumDone: "Completed", sumFailed: "Failed", sumXp: "XP earned", sumEarly: "Early", sumLate: "Late",
    sumBest: n => `Strongest subject: ${n}`, sumWeak: n => `Needs attention: ${n}`, sumBadges: n => n === 1 ? "1 new badge" : `${n} new badges`,
    sumGoal: n => n === 1 ? "Daily goal reached on 1 day" : `Daily goal reached on ${n} days`,
    sumEmpty: "No completed or failed quests last week.", sumGreat: "Let's go",
    tipLate: p => `${p}% of last week's quests were late. Try setting your do-on day a bit earlier than the due date.`,
    tipFail: n => `You gave up on ${n} ${n === 1 ? "quest" : "quests"}. Breaking big quests into subtasks makes them feel smaller.`,
    tipGreat: "No late or failed quests. Keep that pace.", tipStart: "Start small: plan one quest for tomorrow.",
    backup: "Backup", backupDownload: "Download backup", backupRestore: "Restore from backup",
    backupHelp: "Saves all your quests and settings as a .json file.", backupSaved: "Backup saved",
    backupBad: "That file isn't a Quest Log backup.", backupUnavailable: "Downloads aren't available here.",
    restoreQ: n => `Restore ${n} quests from this backup?`,
    restoreBody: "Quests that already exist are replaced with the backup's version. Your other quests stay as they are.",
    restored: n => `${n} quests restored`,
    authLead: "Sign in to see your quests on every device.",
    authGoogle: "Continue with Google", authOr: "or with email",
    authEmail: "Email", authPass: "Password", authSignIn: "Sign in", authSignUp: "Create account", authForgot: "Forgot password?",
    authResetSent: "We sent a reset link to your email.", authNeedEmail: "Enter your email first.",
    authErr: {
      "auth/invalid-credential": "Wrong email or password.", "auth/wrong-password": "Wrong email or password.", "auth/user-not-found": "No account with that email. Use Create account.",
      "auth/email-already-in-use": "That email already has an account. Sign in instead.", "auth/weak-password": "Use at least 6 characters for the password.",
      "auth/invalid-email": "That email address doesn't look right.", "auth/network-request-failed": "No internet connection. Try again when you're online.",
      "auth/popup-blocked": "The sign-in window was blocked. Allow pop-ups and try again.", "auth/unauthorized-domain": "This address isn't allowed in Firebase yet. Add it under Authentication → Settings → Authorized domains.",
      "auth/too-many-requests": "Too many tries. Wait a minute and try again."
    },
    authErrGeneric: "Sign-in didn't work. Try again.",
    configMissing: "Firebase settings are missing. Fill in firebase-config.js.",
    account: "Account", signedInAs: e => `Signed in as ${e}`, signOut: "Sign out", install: "Install app",
    notesTitle: "Notifications", notesEmpty: "No notifications yet. They show up here when something needs your attention.",
    notesNew: "New", notesOld: "Earlier", notesBell: n => n ? `Notifications, ${n} unread` : "Notifications",
    yesterday: "Yesterday",
    n: {
      daily: p => p.n ? `You have ${p.n} ${p.n === 1 ? "quest" : "quests"} today: ${p.items.map(i => i.t + (i.last ? " (due today!)" : "")).join(", ")}${p.n > p.items.length ? "…" : ""}` : "Nothing planned for today. Want to add a quest?",
      plan: p => `You planned to do “${p.t}” today.`,
      tomorrow: p => `Due tomorrow: “${p.t}”`,
      due: p => `Due today: “${p.t}”`,
      overdue: p => `“${p.t}” is past its due date. If you finished it, log it.`,
      streak: p => `Your ${p.n}-day streak is about to end! Finish a quest today.`,
      goal: p => `${p.n} more ${p.n === 1 ? "quest" : "quests"} to reach today's goal.`,
      load: p => `You planned ${p.l} of work for ${p.d}. Your daily limit is ${p.cap}.`,
      idle: p => `“${p.t}” has been waiting for ${p.n} days.`,
      near: p => `${p.n} more ${p.unit} to unlock the “${p.name}” badge.`,
      rec: p => `“${p.t}” was added to your list again.`,
      weekly: () => "Last week's summary is ready."
    },
    units: { quest: n => n === 1 ? "quest" : "quests", day: n => n === 1 ? "day" : "days", level: n => n === 1 ? "level" : "levels" }
  },
  tr: {
    tagline: "Ödevlerin ve görevlerin, quest olarak.",
    tabQuests: "Questler", tabCal: "Takvim", tabStats: "İstatistik", tabHistory: "Geçmiş",
    newQuest: "Yeni quest", settings: "Ayarlar",
    activeN: n => `${n} aktif`, overdueN: n => `${n} overdue`, planN: n => `${n} planı kaçtı`,
    sortBy: "Sırala", sortDue: "Son tarih", sortPlan: "Yapma günü", sortImp: "Önem", sortDiff: "Zorluk",
    emptyTitle: "Aktif quest yok",
    emptyBody: "İlk ödevini ya da görevini ekle. Son tarihini gir, hangi gün yapacağını seç, ne kadar zor ve ne kadar önemli olduğunu belirle.",
    emptyFiltered: "Bu filtreye uyan aktif quest yok.", noResults: q => `“${q}” ile eşleşen bir şey yok.`,
    loading: "Questlerin yükleniyor…",
    due: "Son tarih", plan: "Yapma günü",
    diff: "Zorluk", imp: "Önem",
    diffLabels: ["Kolay", "Orta", "Zor", "Çok zor", "Aşırı zor"],
    impLabels: ["Önemsiz", "Az önemli", "Orta", "Önemli", "Çok önemli"],
    hintSkip: "Zor ama önemsiz", hintWin: "Kolay kazanç",
    complete: "Tamamla", giveUp: "Vazgeç", changeDates: "Tarihi değiştir",
    overdueBadge: "Overdue", extended: n => n > 1 ? `${n} kez uzatıldı` : "Uzatıldı",
    planPassedTitle: "Planladığın gün geçti",
    rel: n => n === 0 ? "bugün" : n === 1 ? "yarın" : n === -1 ? "dün" : n > 0 ? `${n} gün kaldı` : `${-n} gün önce`,
    overdueBy: n => `${n} gün gecikti`,
    fTitle: "Quest adı", fTitlePh: "Tarih ödevi", fDesc: "Açıklama", fDescPh: "Ne yapılması gerekiyor?",
    fDue: "Son tarih", fPlan: "Yapacağın gün", today: "Bugün", tomorrow: "Yarın",
    save: "Kaydet", cancel: "İptal", addQuest: "Questi ekle", editTitle: "Questi düzenle", next: "İleri",
    errTitle: "Questine bir ad ver.", errDue: "Bir son tarih seç.", errPlan: "Hangi gün yapacağını seç.",
    errPlanAfter: "Yapacağın gün son tarihten sonra olamaz.",
    sure: "Evet, eminim",
    completeQ: t => `“${t}” questini bitirdin mi?`, completeQBody: "Sonraki adımda bitirdiğin tarihi gireceksin.",
    overdueQ: "Bu questin son tarihi geçmiş", overdueQBody: "Geç mi bitirdin, yoksa zamanında bitirip girmeyi mi unuttun?",
    optLate: "Geç bitirdim", optForgot: "Zamanında bitirdim, girmeyi unuttum",
    whenDone: "Ne zaman bitirdin?",
    errDate: "Geçerli bir tarih seç.", errDateFuture: "Bu tarih henüz gelmedi.",
    errLateRange: "Geç bitirme tarihi son tarihten sonra olmalı.", errForgotRange: "Zamanında bitirme tarihi son tarihte ya da öncesinde olmalı.",
    timingEarly: n => `${n} gün erken`, timingOntime: "Tam zamanında",
    timingLate: n => `${n} gün geç`, forgotNote: "Tam zamanında sayılır",
    finishedOn: "Bitirildi", bigComplete: "QUESTİ TAMAMLA", bigCompleteNote: "Questi tamamlamak için dokun.",
    giveUpQ: t => `“${t}” questinden vazgeçiyor musun?`, giveUpQBody: "Başarısız quest olarak kaydedilecek, başarı oranını düşürecek ve XP kaybettirecek.", keepGoing: "Devam edeceğim",
    bigGiveUp: "QUESTTEN VAZGEÇ", lastChance: "Son şans. Hâlâ bitirebilirsin.",
    changeQ: t => `“${t}” questinin tarihlerini değiştirmek istiyor musun?`, changeQBody: "Yeni bir son tarih belirleyecek ve yeni bir yapma günü seçeceksin.",
    currentDue: "Şu anki son tarih", currentPlan: "Şu anki yapma günü", newDue: "Yeni son tarih", newPlan: "Yeni yapma günü",
    saveDates: "Tarihleri kaydet", errNewPlan: "Yeni bir yapma günü seç.",
    deleteQuest: "Questi sil", deleteQ: t => `“${t}” kalıcı olarak silinsin mi?`,
    deleteQBody: "Listenden ve istatistiklerinden kaybolur. Geri alınamaz.", deleteYes: "Evet, sil",
    weekLine: n => `Bu hafta ${n} quest tamamladın`,
    failLines: ["Sıradakini bitir.", "Silkelen. Sıradaki quest seni bekliyor.", "Bir sonrakini bitir, bunu telafi et."],
    successRate: p => `Başarı oranın: %${p}`,
    continue: "Devam",
    thisWeek: "Bu hafta", thisMonth: "Bu ay", thisYear: "Bu yıl", allTime: "Tüm zamanlar",
    completedWord: "tamamlandı",
    timingTitle: "Nasıl bitiriyorsun", timingSub: "Tamamlanan questler, son tarihlerine göre",
    early: "Erken", ontime: "Tam zamanında", late: "Geç",
    statusTitle: "Tüm questler", statusSubAll: "Girdiğin bütün questler", statusSubPeriod: "Bu dönemde girdiğin questler",
    sDone: "Tamamlanan", sFailed: "Başarısız", sActive: "Hâlâ açık", questsWord: "quest",
    noData: "Bu dönem için henüz veri yok.",
    rateLine: (p, f) => `Başarı oranı <strong>%${p}</strong> · bu dönemde ${f} başarısız`,
    hAll: "Tümü", hDone: "Tamamlanan", hFailed: "Başarısız",
    failedOn: "Vazgeçildi", failedPill: "Başarısız", forgotTag: "Sonradan girildi",
    histEmpty: "Bitirdiğin ve vazgeçtiğin questler burada görünür.",
    syncOff: "Questlerin yüklenemedi. İnternet bağlantını kontrol et, sonra çıkış yapıp tekrar giriş yap.",
    privateNote: "Bu quest günlüğü yalnızca sahibine özel.",
    saveErr: "Kaydedilemedi. Bağlantını kontrol edip tekrar dene.",
    quota: "Depolama dolu. Yeni quest eklemek için eski questlerden bazılarını sil.",
    soundOn: "Ses açık", soundOff: "Ses kapalı",
    added: "Eklendi", dateChanges: "Tarih değişiklikleri", status: "Durum", activeWord: "Aktif",
    extLine: (a, f, to) => `${a}: son tarih ${f} → ${to}`,
    close: "Kapat", saved: "Kaydedildi", deleted: "Silindi",
    groupToday: "Bugün", groupWeek: "Bu hafta", groupLater: "Sonra",
    loadOf: (l, c) => `${l} / ${c} planlı`, loadOnly: l => `${l} planlı`,
    whatNow: "Şimdi ne yapmalıyım?", suggestTitle: "Şimdi bunu yap", suggestStart: "Tamam, başlıyorum", suggestNext: "Başka öner",
    suggestNone: "Önerilecek quest yok. Önce bir quest ekle.",
    rOverdue: "Overdue", rDueToday: "Son gün bugün", rDueTomorrow: "Son gün yarın", rDueSoon: n => `Son tarihe ${n} gün`,
    rPlanned: "Bugüne planladın", rPlanPassed: "Planladığın gün geçti", rImportant: "Çok önemli", rQuick: "Kolay kazanç",
    category: "Ders", noCat: "Yok", newCat: "Yeni", catPh: "Matematik", addCat: "Ekle", allCats: "Tümü", uncategorized: "Derssiz",
    est: "Tahmini süre", estHours: "saat",
    fmtMin: m => { const h = Math.floor(m / 60), r = m % 60; return h ? (r ? `${h}s ${r}dk` : `${h}s`) : `${r}dk`; },
    loadWarn: (day, total, cap) => `${day} günü toplam ${total} iş planlamış olursun. Günlük sınırın ${cap}.`,
    subtasks: "Alt görevler", addSub: "Ekle", subPh: "Kaynak araştır", subProgress: (d, n) => `${d}/${n} alt görev`,
    repeat: "Tekrarla", rep: { none: "Tekrarlama", daily: "Her gün", weekly: "Her hafta", biweekly: "2 haftada bir", monthly: "Her ay" },
    repeatNote: "Bu quest bitince, vazgeçilince ya da son tarihi geçince bir sonraki kendiliğinden oluşur.",
    level: n => `Seviye ${n}`, lvTitles: ["Çırak", "Maceracı", "Gezgin", "Savaşçı", "Şövalye", "Kahraman", "Şampiyon", "Efsane", "Mitolojik"],
    xpOf: (a, b) => `${a} / ${b} XP`,
    streak: n => `${n} günlük seri`, noStreak: "Henüz seri yok",
    totalXp: n => `Toplam ${n} XP`, bestStreak: n => `En uzun seri: ${n} gün`,
    byCat: "Derslere göre", byCatSub: "Bu dönemde tamamlanan ve vazgeçilen questler",
    catLine: (d, lp, f) => `${d} tamamlandı · %${lp} geç · ${f} başarısız`,
    reopen: "Tekrar aktif yap", reopenQ: t => `“${t}” tekrar aktif olsun mu?`,
    reopenBody: "Quest listene geri döner ve bu questten gelen XP değişikliği geri alınır.", reopened: "Listene geri döndü",
    capacity: "Günlük sınır (saat)", capacityHelp: "Bir güne bundan fazla iş planlarsan uyarı alırsın.",
    manageCats: "Dersler", noCats: "Henüz ders yok. Aşağıdan ekle.", removeCat: "Kaldır",
    dayFilter: d => `Sadece ${d}`, clear: "Temizle", weekLoad: "Önümüzdeki 7 gün",
    levelText: (n, title) => `Seviye ${n} · ${title}`,
    searchPh: "Quest ara", searchClear: "Aramayı temizle",
    calPrev: "Önceki ay", calNext: "Sonraki ay", calToday: "Bugün",
    calDue: "Son tarihi bu gün", calPlanned: "Bu güne planlanan", calDone: "Bu gün bitirilen",
    calEmpty: "Bu günde bir şey yok.", calAdd: "Bu güne quest ekle",
    legendDue: "Son tarih (ders rengiyle)", legendPlan: "Yapma günü", legendDone: "Bitirildi",
    calMonthView: "Ay", calListView: "Liste", calMonthEmpty: "Bu ayda bir şey yok.",
    lblDue: "Son gün", lblPlan: "Yapılacak", lblDone: "Bitti", editBtn: "Düzenle",
    pkLeft: m => `${m} kaldı`, pkDetails: "Detaylar",
    dailyGoal: "Günlük hedef (quest)", dailyGoalHelp: "Bir günde bu kadar quest bitirirsen +20 bonus XP kazanırsın. 0 yazarsan kapanır.",
    goalLabel: "Günlük hedef", goalDone: "Günlük hedef tamam · +20 XP",
    badgesTitle: "Rozetler", badgesSub: (a, b) => `${b} rozetten ${a} tanesi açıldı`, badgeEarned: d => `${d} tarihinde açıldı`, badgesChip: (a, b) => `${a}/${b}`,
    summaryTitle: "Geçen haftan", summaryBtn: "Geçen haftanın özeti",
    sumDone: "Tamamlanan", sumFailed: "Vazgeçilen", sumXp: "Kazanılan XP", sumEarly: "Erken", sumLate: "Geç",
    sumBest: n => `En güçlü dersin: ${n}`, sumWeak: n => `Dikkat isteyen ders: ${n}`, sumBadges: n => `${n} yeni rozet`,
    sumGoal: n => `Günlük hedefe ${n} gün ulaştın`,
    sumEmpty: "Geçen hafta tamamlanan ya da vazgeçilen quest yok.", sumGreat: "Hadi devam",
    tipLate: p => `Geçen hafta questlerinin %${p}'i geç bitti. Yapma gününü son tarihten biraz daha önceye koymayı dene.`,
    tipFail: n => `${n} questten vazgeçtin. Büyük questleri alt görevlere bölersen daha kolay gelir.`,
    tipGreat: "Hiç geç kalmadın, hiç vazgeçmedin. Bu tempoyu koru.", tipStart: "Küçük başla: yarın için bir quest planla.",
    backup: "Yedek", backupDownload: "Yedeği indir", backupRestore: "Yedekten geri yükle",
    backupHelp: "Bütün questlerini ve ayarlarını bir .json dosyası olarak kaydeder.", backupSaved: "Yedek kaydedildi",
    backupBad: "Bu dosya bir Quest Log yedeği değil.", backupUnavailable: "Bu görünümde indirme kullanılamıyor.",
    restoreQ: n => `Bu yedekten ${n} quest geri yüklensin mi?`,
    restoreBody: "Zaten var olan questler yedekteki haliyle değiştirilir. Diğer questlerin olduğu gibi kalır.",
    restored: n => `${n} quest geri yüklendi`,
    authLead: "Questlerini her cihazda görmek için giriş yap.",
    authGoogle: "Google ile devam et", authOr: "ya da e-posta ile",
    authEmail: "E-posta", authPass: "Şifre", authSignIn: "Giriş yap", authSignUp: "Hesap oluştur", authForgot: "Şifremi unuttum",
    authResetSent: "Şifre sıfırlama bağlantısını e-postana gönderdik.", authNeedEmail: "Önce e-posta adresini yaz.",
    authErr: {
      "auth/invalid-credential": "E-posta ya da şifre yanlış.", "auth/wrong-password": "E-posta ya da şifre yanlış.", "auth/user-not-found": "Bu e-postayla bir hesap yok. Hesap oluştur'a bas.",
      "auth/email-already-in-use": "Bu e-postanın zaten bir hesabı var. Giriş yap'a bas.", "auth/weak-password": "Şifre en az 6 karakter olmalı.",
      "auth/invalid-email": "Bu e-posta adresi doğru görünmüyor.", "auth/network-request-failed": "İnternet bağlantısı yok. Bağlanınca tekrar dene.",
      "auth/popup-blocked": "Giriş penceresi engellendi. Açılır pencerelere izin verip tekrar dene.", "auth/unauthorized-domain": "Bu adres Firebase'de henüz izinli değil. Authentication → Settings → Authorized domains kısmına ekle.",
      "auth/too-many-requests": "Çok fazla deneme oldu. Bir dakika bekleyip tekrar dene."
    },
    authErrGeneric: "Giriş yapılamadı. Tekrar dene.",
    configMissing: "Firebase ayarları eksik. firebase-config.js dosyasını doldur.",
    account: "Hesap", signedInAs: e => `${e} olarak giriş yaptın`, signOut: "Çıkış yap", install: "Uygulamayı yükle",
    notesTitle: "Bildirimler", notesEmpty: "Henüz bildirim yok. Dikkat etmen gereken bir şey olunca burada görünür.",
    notesNew: "Yeni", notesOld: "Daha önce", notesBell: n => n ? `Bildirimler, ${n} okunmamış` : "Bildirimler",
    yesterday: "Dün",
    n: {
      daily: p => p.n ? `Bugün ${p.n} quest'in var: ${p.items.map(i => i.t + (i.last ? " (son gün!)" : "")).join(", ")}${p.n > p.items.length ? "…" : ""}` : "Bugün için planlı quest yok. Yeni bir quest eklemeye ne dersin?",
      plan: p => `Bugün “${p.t}” questini yapmayı planlamıştın.`,
      tomorrow: p => `Yarın son gün: “${p.t}”`,
      due: p => `Bugün son gün: “${p.t}”`,
      overdue: p => `“${p.t}” questinin süresi geçti. Bitirdiysen girmeyi unutma.`,
      streak: p => `${p.n} günlük serin bitmek üzere! Bugün bir quest bitir.`,
      goal: p => `Günlük hedefe ${p.n} quest kaldı.`,
      load: p => `${p.d} için ${p.l} iş planladın, günlük sınırın ${p.cap}.`,
      idle: p => `“${p.t}” ${p.n} gündür bekliyor.`,
      near: p => `“${p.name}” rozetine ${p.n} ${p.unit} kaldı.`,
      rec: p => `Yeni tekrar: “${p.t}” listene eklendi.`,
      weekly: () => "Geçen haftanın özeti hazır."
    },
    units: { quest: () => "quest", day: () => "gün", level: () => "seviye" }
  }
};

/* ---------- badges ---------- */
const GLYPH = {
  check: "M7 12.5l3.5 3.5L17 9",
  star: "M12 5.5l1.9 4 4.3.5-3.2 3 .9 4.3L12 15.1l-3.9 2.2.9-4.3-3.2-3 4.3-.5z",
  crown: "M5 16.5h14l1-8.5-4.5 3L12 6l-3.5 5L4 8z",
  bolt: "M13 4L6.5 13H11l-1 7 6.5-9H12z",
  clock: "M18 12a6 6 0 1 1-12 0 6 6 0 0 1 12 0zM12 8.5V12l2.5 1.5",
  flame: "M12 4c.8 2.8 4 4.8 4 8.8a4 4 0 0 1-8 0c0-1.8.8-3 1.8-4 .2 1.3.8 2.2 1.8 2.6C11.2 9.6 11.2 6.8 12 4z",
  sword: "M17.5 5.5l1-.5-.5 1-7.5 7.5-1-1zM9.5 12.5l2 2M7.5 14l2.5 2.5M6 18l2-2",
  heart: "M12 18s-6-3.6-6-8a3.2 3.2 0 0 1 6-1.6A3.2 3.2 0 0 1 18 10c0 4.4-6 8-6 8z",
  list: "M10 8h7M10 12h7M10 16h7M6.5 8h.01M6.5 12h.01M6.5 16h.01",
  cal: "M6 7.5h12V18H6zM6 11h12M9 5.5v3M15 5.5v3",
  target: "M18 12a6 6 0 1 1-12 0 6 6 0 0 1 12 0zM15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z",
  sparkle: "M12 5v4M12 15v4M5 12h4M15 12h4M8 8l1.8 1.8M14.2 14.2L16 16M16 8l-1.8 1.8M9.8 14.2L8 16",
  book: "M6 6.5h4.5A1.5 1.5 0 0 1 12 8v10a1.5 1.5 0 0 0-1.5-1.5H6zM18 6.5h-4.5A1.5 1.5 0 0 0 12 8v10a1.5 1.5 0 0 1 1.5-1.5H18z"
};
const BADGES = [
  { id: "first", icon: "check", stat: "done", need: 1, en: ["First step", "Complete your first quest."], tr: ["İlk adım", "İlk questini tamamla."] },
  { id: "q10", icon: "check", stat: "done", need: 10, en: ["Ten down", "Complete 10 quests."], tr: ["Onluk", "10 quest tamamla."] },
  { id: "q50", icon: "star", stat: "done", need: 50, en: ["Fifty strong", "Complete 50 quests."], tr: ["Elli quest", "50 quest tamamla."] },
  { id: "q100", icon: "crown", stat: "done", need: 100, en: ["Centurion", "Complete 100 quests."], tr: ["Yüzbaşı", "100 quest tamamla."] },
  { id: "early10", icon: "bolt", stat: "early", need: 10, en: ["Early bird", "Finish 10 quests before their due date."], tr: ["Erkenci kuş", "10 questi son tarihinden önce bitir."] },
  { id: "ontime5", icon: "clock", stat: "run", need: 5, en: ["Punctual", "Finish 5 quests in a row without being late."], tr: ["Dakik", "Üst üste 5 questi geç kalmadan bitir."] },
  { id: "streak3", icon: "flame", stat: "streak", need: 3, en: ["Warming up", "Reach a 3-day streak."], tr: ["Isınma turu", "3 günlük seriye ulaş."] },
  { id: "streak7", icon: "flame", stat: "streak", need: 7, en: ["On fire", "Reach a 7-day streak."], tr: ["Ateşli hafta", "7 günlük seriye ulaş."] },
  { id: "streak30", icon: "flame", stat: "streak", need: 30, en: ["Unstoppable", "Reach a 30-day streak."], tr: ["Durdurulamaz", "30 günlük seriye ulaş."] },
  { id: "brutal1", icon: "sword", stat: "brutal", need: 1, en: ["Dragon hunter", "Finish a Brutal quest."], tr: ["Ejderha avcısı", "Aşırı zor bir quest bitir."] },
  { id: "brutal5", icon: "sword", stat: "brutal", need: 5, en: ["Dragon slayer", "Finish 5 Brutal quests."], tr: ["Ejderha katili", "5 aşırı zor quest bitir."] },
  { id: "crit5", icon: "heart", stat: "crit", need: 5, en: ["Lifesaver", "Finish 5 Critical quests without being late."], tr: ["Hayat kurtaran", "Çok önemli 5 questi geç kalmadan bitir."] },
  { id: "sub5", icon: "list", stat: "subs", need: 1, en: ["Piece by piece", "Finish a quest with 5 or more subtasks, all ticked."], tr: ["Parça parça", "En az 5 alt görevli bir questin hepsini bitir."] },
  { id: "planner10", icon: "cal", stat: "planner", need: 10, en: ["Planner", "Finish 10 quests on or before the day you planned."], tr: ["Planlayıcı", "10 questi planladığın günde ya da önce bitir."] },
  { id: "goal1", icon: "target", stat: "goal", need: 1, en: ["Goal getter", "Reach your daily goal."], tr: ["Hedef tamam", "Günlük hedefine ulaş."] },
  { id: "goal7", icon: "target", stat: "goal", need: 7, en: ["Goal machine", "Reach your daily goal on 7 days."], tr: ["Hedef makinesi", "Günlük hedefine 7 gün ulaş."] },
  { id: "clean", icon: "sparkle", stat: "clean", need: 1, en: ["Clean week", "Finish 3+ quests in one week with nothing late or given up."], tr: ["Temiz hafta", "Bir haftada en az 3 quest bitir; hiç geç kalma, hiç vazgeçme."] },
  { id: "lvl5", icon: "crown", stat: "level", need: 5, en: ["Knighted", "Reach level 5."], tr: ["Şövalye", "5. seviyeye ulaş."] },
  { id: "subjects4", icon: "book", stat: "subjects", need: 4, en: ["All-rounder", "Finish quests in 4 different subjects."], tr: ["Çok yönlü", "4 farklı derste quest bitir."] }
];
const medal = (icon, cls = "") => `<svg viewBox="0 0 52 52" class="${cls}" aria-hidden="true"><circle class="medal-bg" cx="26" cy="26" r="22" stroke-width="3"/><g transform="translate(14 14)" fill="none" class="medal-ink" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="${GLYPH[icon]}"/></g></svg>`;

/* ---------- small helpers ---------- */
const $ = s => document.querySelector(s);
const lsGet = (k, d) => { try { const v = localStorage.getItem(k); return v == null ? d : v; } catch { return d; } };
const lsSet = (k, v) => { try { localStorage.setItem(k, v); } catch {} };
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const pad = n => String(n).padStart(2, "0");
const toStr = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const parseD = s => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
const today = () => toStr(new Date());
const addDays = (s, n) => { const d = parseD(s); d.setDate(d.getDate() + n); return toStr(d); };
const isDate = s => typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s);
const diffDays = (a, b) => { // b − a
  const [y1, m1, d1] = a.split("-").map(Number), [y2, m2, d2] = b.split("-").map(Number);
  return Math.round((Date.UTC(y2, m2 - 1, d2) - Date.UTC(y1, m1 - 1, d1)) / 86400000);
};
const weekStart = s => { const d = parseD(s); d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); return toStr(d); };
function periodRange(p) {
  const t = today();
  if (p === "week") { const ws = weekStart(t); return [ws, addDays(ws, 6)]; }
  if (p === "month") { const d = parseD(t); return [toStr(new Date(d.getFullYear(), d.getMonth(), 1)), toStr(new Date(d.getFullYear(), d.getMonth() + 1, 0))]; }
  if (p === "year") { const y = t.slice(0, 4); return [`${y}-01-01`, `${y}-12-31`]; }
  return null;
}
const inRange = (s, r) => !!s && (!r || (s >= r[0] && s <= r[1]));
const pct = (n, total) => total ? Math.round((n / total) * 100) : 0;
const classify = (done, due) => done < due ? "early" : done > due ? "late" : "ontime";
const reducedMotion = () => window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const ID_RE = /^[A-Za-z0-9_\-.~:@+]{1,200}$/;
function stepDate(s, rep) {
  if (rep === "daily") return addDays(s, 1);
  if (rep === "weekly") return addDays(s, 7);
  if (rep === "biweekly") return addDays(s, 14);
  if (rep === "monthly") {
    const [y, m, d] = s.split("-").map(Number);
    const ny = m === 12 ? y + 1 : y, nm = m === 12 ? 1 : m + 1;
    return `${ny}-${pad(nm)}-${pad(Math.min(d, new Date(ny, nm, 0).getDate()))}`;
  }
  return addDays(s, 7);
}

/* ---------- XP, levels, streaks, badges ---------- */
const GOAL_BONUS = 20;
const xpFor = (d, i, timing) => Math.round((10 * d + 6 * i) * (timing === "early" ? 1.25 : timing === "late" ? 0.6 : 1));
const failCost = i => 5 + 3 * i;
const questXp = q => q.status === "done" ? (q.xp ?? xpFor(q.difficulty, q.importance, q.timing)) + (q.goalBonus || 0) : q.status === "failed" ? -(q.xpLoss ?? failCost(q.importance)) : 0;
const totalXp = (list = state.quests) => Math.max(0, list.reduce((a, q) => a + questXp(q), 0));
function levelInfo(xp) {
  let lvl = 1, need = 100, rem = xp;
  while (rem >= need) { rem -= need; lvl++; need += 50; }
  return { lvl, into: rem, need };
}
const lvTitle = lvl => { const ts = L().lvTitles; return ts[Math.min(lvl, ts.length) - 1]; };
function streaks() {
  const days = new Set(state.quests.filter(q => q.status === "done" && q.doneDate).map(q => q.doneDate));
  let cur = 0, d = today();
  if (!days.has(d)) d = addDays(d, -1);
  while (days.has(d)) { cur++; d = addDays(d, -1); }
  const sorted = [...days].sort();
  let best = 0, run = 0, prev = null;
  for (const s of sorted) { run = prev && diffDays(prev, s) === 1 ? run + 1 : 1; best = Math.max(best, run); prev = s; }
  return { cur, best };
}
const doneOn = day => state.quests.filter(q => q.status === "done" && q.doneDate === day).length;
function badgeStats() {
  const done = state.quests.filter(q => q.status === "done").sort((a, b) => (a.doneDate || "").localeCompare(b.doneDate || "") || a.resolvedAt - b.resolvedAt);
  const failed = state.quests.filter(q => q.status === "failed");
  let run = 0, bestRun = 0;
  for (const q of done) { run = q.timing === "late" ? 0 : run + 1; bestRun = Math.max(bestRun, run); }
  const perDay = {};
  done.forEach(q => { perDay[q.doneDate] = (perDay[q.doneDate] || 0) + 1; });
  const goal = state.settings.dailyGoal;
  const weeks = {};
  done.forEach(q => { const w = weekStart(q.doneDate); (weeks[w] = weeks[w] || { d: 0, bad: 0 }).d++; if (q.timing === "late") weeks[w].bad++; });
  failed.forEach(q => { if (!q.failedDate) return; const w = weekStart(q.failedDate); (weeks[w] = weeks[w] || { d: 0, bad: 0 }).bad++; });
  return {
    done: done.length,
    early: done.filter(q => q.timing === "early").length,
    run: bestRun,
    streak: streaks().best,
    brutal: done.filter(q => q.difficulty === 5).length,
    crit: done.filter(q => q.importance === 5 && q.timing !== "late").length,
    subs: done.filter(q => q.subtasks.length >= 5 && q.subtasks.every(s => s.done)).length,
    planner: done.filter(q => q.plan && q.doneDate <= q.plan).length,
    goal: goal > 0 ? Object.values(perDay).filter(n => n >= goal).length : 0,
    clean: Object.values(weeks).filter(w => w.d >= 3 && w.bad === 0).length,
    level: levelInfo(totalXp()).lvl,
    subjects: new Set(done.filter(q => q.cat).map(q => q.cat)).size
  };
}
const badgeText = b => b[state.lang] || b.en;

/* ---------- state ---------- */
const state = {
  quests: [], loaded: false, sync: "pending",
  settings: { categories: [], capacity: 240, dailyGoal: 2, badges: {}, lastSummary: null },
  tab: lsGet("ql-tab", "quests"), sort: lsGet("ql-sort", "due"), period: lsGet("ql-period", "all"), hist: "all",
  catFilter: lsGet("ql-cat", "all"), dayFilter: null, q: "",
  calMonth: today().slice(0, 7), calDay: today(),
  calView: lsGet("ql-calview", window.innerWidth < 640 ? "list" : "month"),
  lang: lsGet("ql-lang", "tr"), sound: lsGet("ql-sound", "1") === "1",
  sheet: null, openSubs: new Set(), highlight: null, inbox: {}
};
if (!I18N[state.lang]) state.lang = "tr";
if (!["quests", "calendar", "stats", "history"].includes(state.tab)) state.tab = "quests";
let col = null, settingsRef = null, currentUser = null, installEvt = null;
let questsReady = false, settingsReady = false, inboxReady = false, bootChecked = false;
let inboxRef = null;
const pendingNotes = new Set();

const L = () => I18N[state.lang];
const t = (k, ...a) => { const v = L()[k]; return typeof v === "function" ? v(...a) : v; };
const locale = () => state.lang === "tr" ? "tr-TR" : "en-GB";
const fmt = (s, o = { weekday: "short", day: "numeric", month: "short" }) => isDate(s) ? parseD(s).toLocaleDateString(locale(), o) : "—";
const fmtLong = s => fmt(s, { weekday: "long", day: "numeric", month: "long" });
const fmtMin = m => L().fmtMin(Math.max(0, Math.round(m)));
const byId = id => state.quests.find(q => q.id === id);
const catById = id => state.settings.categories.find(c => c.id === id);
const lower = s => String(s || "").toLocaleLowerCase(locale());
const timingText = q => {
  if (q.timing === "early") return t("timingEarly", Math.max(1, diffDays(q.doneDate, q.due)));
  if (q.timing === "late") return t("timingLate", Math.max(1, diffDays(q.due, q.doneDate)));
  return t("timingOntime");
};
const extCount = q => (q.extensions || []).filter(e => e.toDue > e.fromDue).length;
const weekDoneCount = () => { const r = periodRange("week"); return state.quests.filter(q => q.status === "done" && inRange(q.doneDate, r)).length; };
const effDay = q => { const td = today(), d = q.plan || q.due; return d < td ? td : d; };
const remainingMin = q => {
  if (!q.est) return 0;
  const n = q.subtasks.length;
  return n ? q.est * (1 - q.subtasks.filter(s => s.done).length / n) : q.est;
};
function dayLoad(day, excludeId) {
  return state.quests.filter(q => q.status === "active" && q.id !== excludeId && effDay(q) === day).reduce((a, q) => a + remainingMin(q), 0);
}
function matches(q) {
  if (!state.q.trim()) return true;
  const needle = lower(state.q.trim());
  const hay = lower([q.title, q.desc, catById(q.cat)?.name, ...q.subtasks.map(s => s.text)].join(" "));
  return hay.includes(needle);
}

const ICON_CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>';
const ICON_CAL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/></svg>';
const ICON_FLAG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 21V4M5 4h11l-2 4 2 4H5"/></svg>';
const ICON_CLOCK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></svg>';
const ICON_REPEAT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 11V9a3 3 0 0 1 3-3h12l-3-3M20 13v2a3 3 0 0 1-3 3H5l3 3"/></svg>';
const ICON_CHEV = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';
const ICON_COMPASS = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z"/></svg>';
const ICON_FLAME = '<svg class="flame" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2c1 3.5 5 6 5 11a5 5 0 0 1-10 0c0-2.2 1-3.8 2.2-5 .2 1.6 1 2.8 2.3 3.3C11 9 11 5.5 12 2z"/></svg>';
const ICON_MEDAL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="14.5" r="5.5"/><path d="M8.5 10 6 3h4l2 4 2-4h4l-2.5 7"/></svg>';
const ICON_LEFT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 6-6 6 6 6"/></svg>';
const ICON_EDIT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16zM13.5 6.5l4 4"/></svg>';
const ICON_RIGHT ='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg>';

const bars = (kind, v) => `<span class="bars ${kind}" aria-hidden="true">${[1, 2, 3, 4, 5].map(i => `<i class="${i <= v ? "on" : ""}" style="--h:${i}"></i>`).join("")}</span>`;
const catTag = id => { const c = catById(id); return c ? `<span class="tag cat" style="--c:var(--cat${c.color % 8})"><i class="dot"></i>${esc(c.name)}</span>` : ""; };
const catDot = id => { const c = catById(id); return c ? `<i class="dot" style="--c:var(--cat${c.color % 8})" title="${esc(c.name)}"></i>` : ""; };

/* ---------- sound ---------- */
let actx = null, aout = null, arev = null;
function audio() {
  if (!state.sound) return null;
  try {
    if (!actx) {
      actx = new (window.AudioContext || window.webkitAudioContext)();
      const comp = actx.createDynamicsCompressor(); comp.connect(actx.destination);
      aout = actx.createGain(); aout.gain.value = 0.9; aout.connect(comp);
      arev = actx.createConvolver();
      const len = actx.sampleRate * 2.4, b = actx.createBuffer(2, len, actx.sampleRate);
      for (let c = 0; c < 2; c++) { const d = b.getChannelData(c); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6); }
      arev.buffer = b;
      const rg = actx.createGain(); rg.gain.value = 0.35; arev.connect(rg); rg.connect(comp);
    }
    if (actx.state === "suspended") actx.resume();
    return actx;
  } catch { return null; }
}
function tone(o) {
  const t0 = actx.currentTime + (o.t || 0), d = o.d || 0.3, v = o.v || 0.2, a = o.a || 0.012;
  const osc = actx.createOscillator(), g = actx.createGain();
  osc.type = o.type || "sine"; osc.frequency.setValueAtTime(o.f, t0);
  if (o.to) osc.frequency.exponentialRampToValueAtTime(o.to, t0 + d);
  if (o.vib) {
    const l = actx.createOscillator(), lg = actx.createGain();
    l.frequency.value = o.vib; lg.gain.value = o.f * 0.02; l.connect(lg); lg.connect(osc.frequency);
    l.start(t0 + d * 0.3); l.stop(t0 + d + 0.1);
  }
  let node = osc;
  if (o.lp) {
    const f = actx.createBiquadFilter(); f.type = "lowpass"; f.frequency.setValueAtTime(o.lp, t0);
    if (o.lpTo) f.frequency.exponentialRampToValueAtTime(o.lpTo, t0 + Math.min(0.15, d));
    f.Q.value = 1; osc.connect(f); node = f;
  }
  node.connect(g);
  g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(v, t0 + a);
  g.gain.setValueAtTime(v, t0 + Math.max(a, d * (o.hold || 0.5)));
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + d);
  g.connect(aout); if (o.wet !== false) g.connect(arev);
  osc.start(t0); osc.stop(t0 + d + 0.05);
}
function noise(o) {
  const t0 = actx.currentTime + (o.t || 0), d = o.d, len = Math.ceil(actx.sampleRate * d);
  const b = actx.createBuffer(1, len, actx.sampleRate), x = b.getChannelData(0);
  for (let i = 0; i < len; i++) x[i] = Math.random() * 2 - 1;
  const s = actx.createBufferSource(); s.buffer = b;
  const f = actx.createBiquadFilter(); f.type = o.type || "bandpass"; f.Q.value = o.q || 0.8; f.frequency.setValueAtTime(o.f, t0);
  const g = actx.createGain(); g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(o.v, t0 + 0.005); g.gain.exponentialRampToValueAtTime(0.0001, t0 + d);
  s.connect(f); f.connect(g); g.connect(aout); g.connect(arev); s.start(t0);
}
const brass = (f, t0, d, v) => { tone({ f, t: t0, d, v, type: "sawtooth", lp: 400, lpTo: 2600, a: 0.04, hold: 0.7 }); tone({ f: f * 1.004, t: t0, d, v: v * 0.6, type: "sawtooth", lp: 400, lpTo: 2200, a: 0.05, hold: 0.7 }); };
const bell = (f, t0, d, v) => { tone({ f, t: t0, d, v, a: 0.005, hold: 0.02 }); tone({ f: f * 2.76, t: t0, d: d * 0.5, v: v * 0.3, a: 0.005, hold: 0.02 }); tone({ f: f * 5.4, t: t0, d: d * 0.25, v: v * 0.12, a: 0.005, hold: 0.02 }); };
const kick = (t0, v) => tone({ f: 150, to: 40, t: t0, d: 0.35, v, a: 0.003, hold: 0.05, wet: false });
const SFX = {
  win() { // orchestra hit: timpani roll into a full chord
    for (let i = 0; i < 16; i++) tone({ f: 98, t: i * 0.045, d: 0.12, v: 0.04 + i * 0.012, a: 0.003, hold: 0.05, wet: false });
    kick(0.75, 0.6);
    noise({ t: 0.75, d: 1.6, v: 0.12, type: "highpass", f: 6000, q: 0.5 });
    noise({ t: 0.75, d: 0.4, v: 0.3, type: "lowpass", f: 800 });
    [130.81, 196, 261.63, 329.63, 392].forEach(f => brass(f, 0.75, 1.6, 0.08));
  },
  fail() { // sad trombone
    [[392, 0], [369.99, 0.38], [349.23, 0.76]].forEach(([f, t0]) => brass(f * 0.75, t0, 0.34, 0.13));
    tone({ f: 247.2, t: 1.14, d: 1.4, v: 0.12, type: "sawtooth", lp: 500, lpTo: 1500, a: 0.05, hold: 0.7, vib: 6 });
    tone({ f: 247.2 * 1.005, t: 1.14, d: 1.4, v: 0.08, type: "sawtooth", lp: 500, lpTo: 1300, a: 0.05, hold: 0.7, vib: 6 });
  },
  level() {
    [523.25, 659.25, 783.99, 1046.5, 1318.5, 1567.98, 2093].forEach((f, i) => bell(f, i * 0.07, 1.2, 0.06));
    [261.63, 329.63, 392, 523.25].forEach(f => brass(f, 0.5, 1.3, 0.07));
  },
  tick() { tone({ f: 1500, d: 0.05, v: 0.05, type: "triangle", wet: false, a: 0.003, hold: 0.1 }); },
  pop() { tone({ f: 880, d: 0.09, v: 0.07, type: "triangle", wet: false, a: 0.004, hold: 0.2 }); tone({ f: 1318.5, t: 0.06, d: 0.16, v: 0.06, type: "triangle", a: 0.004, hold: 0.2 }); }
};
function sfx(name, delay = 0) {
  if (!audio()) return;
  const run = () => { try { SFX[name](); } catch {} };
  delay ? setTimeout(run, delay) : run();
}

/* ---------- rendering ---------- */
function renderChrome() {
  document.documentElement.lang = state.lang;
  $("#tagline").textContent = t("tagline");
  $("#lang-tr").setAttribute("aria-pressed", state.lang === "tr");
  $("#lang-en").setAttribute("aria-pressed", state.lang === "en");
  const sb = $("#sound-btn");
  sb.setAttribute("aria-pressed", state.sound);
  sb.setAttribute("aria-label", state.sound ? t("soundOn") : t("soundOff"));
  sb.title = state.sound ? t("soundOn") : t("soundOff");
  $("#snd-wave").toggleAttribute("hidden", !state.sound);
  $("#snd-off").toggleAttribute("hidden", state.sound);
  const gb = $("#settings-btn");
  gb.setAttribute("aria-label", t("settings")); gb.title = t("settings");
  gb.hidden = state.sync !== "on";
  const active = state.quests.filter(q => q.status === "active").length;
  const tabs = { quests: t("tabQuests"), calendar: t("tabCal"), stats: t("tabStats"), history: t("tabHistory") };
  for (const k of Object.keys(tabs)) {
    const b = $("#tab-" + k);
    b.innerHTML = esc(tabs[k]) + (k === "quests" && state.loaded ? `<span class="count">${active}</span>` : "");
    b.setAttribute("aria-selected", state.tab === k);
  }
  const sbar = $("#searchbar");
  sbar.hidden = !state.loaded || !(state.tab === "quests" || state.tab === "history");
  $("#q").placeholder = t("searchPh");
  $("#q").setAttribute("aria-label", t("searchPh"));
  $("#q-clear").hidden = !state.q;
  $("#q-clear").setAttribute("aria-label", t("searchClear"));
  $("#fab-label").textContent = t("newQuest");
  updateBell();
  $("#install-btn").hidden = !installEvt;
  $("#install-btn").textContent = t("install");
  $("#fab").hidden = state.sync === "off" || state.sync === "private";
  $("#ov-continue").textContent = t("continue");
  renderPlayer();
}

function renderPlayer() {
  const p = $("#player");
  if (state.sync === "private" || !state.loaded) { p.hidden = true; return; }
  p.hidden = false;
  const xp = totalXp(), info = levelInfo(xp), st = streaks();
  const goal = state.settings.dailyGoal, got = doneOn(today());
  const r = 7, c = 2 * Math.PI * r, frac = goal ? Math.min(1, got / goal) : 0;
  const earned = Object.keys(state.settings.badges).filter(id => BADGES.some(b => b.id === id)).length;
  p.innerHTML = `
    <div class="lv" title="${esc(t("level", info.lvl))}">
      <svg viewBox="0 0 50 54" aria-hidden="true"><path d="M25 2 47 12v14c0 13-9.4 22.6-22 26C12.4 48.6 3 39 3 26V12z" fill="currentColor"/></svg>
      <span>${info.lvl}</span>
    </div>
    <div class="xp">
      <div class="xp-top"><strong>${esc(lvTitle(info.lvl))}</strong><span>${esc(t("xpOf", info.into, info.need))}</span></div>
      <div class="xp-bar" role="progressbar" aria-valuemin="0" aria-valuemax="${info.need}" aria-valuenow="${info.into}" aria-label="${esc(t("level", info.lvl))}"><i style="width:${(info.into / info.need) * 100}%"></i></div>
    </div>
    <div class="p-chips">
      ${goal ? `<span class="pchip ${got >= goal ? "met" : ""}" title="${esc(t("goalLabel"))}" aria-label="${esc(t("goalLabel"))} ${got}/${goal}">
        <svg viewBox="0 0 18 18" aria-hidden="true"><circle class="ring-bg" cx="9" cy="9" r="${r}" fill="none" stroke-width="3"/><circle class="ring-fg" cx="9" cy="9" r="${r}" fill="none" stroke-width="3" stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - frac)}" transform="rotate(-90 9 9)"/></svg>${Math.min(got, 99)}/${goal}</span>` : ""}
      <span class="pchip ${st.cur ? "on" : ""}">${ICON_FLAME}${esc(st.cur ? t("streak", st.cur) : t("noStreak"))}</span>
      <button type="button" class="pchip" data-act="goto-badges" title="${esc(t("badgesTitle"))}" aria-label="${esc(t("badgesTitle"))} ${earned}/${BADGES.length}">${ICON_MEDAL}${esc(t("badgesChip", earned, BADGES.length))}</button>
    </div>`;
}

function renderView() {
  const v = $("#view");
  let notice = "";
  if (state.sync === "off") notice = `<p class="notice">${esc(t("syncOff"))}</p>`;
  if (state.sync === "private") { v.innerHTML = `<p class="notice">${esc(t("privateNote"))}</p>`; return; }
  if (state.tab === "stats") v.innerHTML = notice + renderStats();
  else if (state.tab === "history") v.innerHTML = notice + renderHistory();
  else if (state.tab === "calendar") v.innerHTML = notice + renderCalendar();
  else v.innerHTML = notice + renderQuests();
}
function render() { if (!currentUser) { renderAuth(); return; } renderChrome(); renderView(); }

function sortQuests(list) {
  const cmp = {
    due: (a, b) => a.due.localeCompare(b.due) || (a.plan || "").localeCompare(b.plan || ""),
    plan: (a, b) => (a.plan || "9").localeCompare(b.plan || "9") || a.due.localeCompare(b.due),
    imp: (a, b) => (b.importance - a.importance) || a.due.localeCompare(b.due),
    diff: (a, b) => (b.difficulty - a.difficulty) || a.due.localeCompare(b.due)
  }[state.sort] || ((a, b) => a.due.localeCompare(b.due));
  return list.slice().sort(cmp);
}

function questCard(q) {
  const td = today();
  const overdue = td > q.due;
  const planPassed = !!q.plan && td > q.plan;
  const ext = extCount(q);
  const dueRel = overdue ? t("overdueBy", diffDays(q.due, td)) : t("rel", diffDays(td, q.due));
  const planRel = q.plan ? t("rel", diffDays(td, q.plan)) : "";
  let hint = "";
  if (q.difficulty >= 4 && q.importance <= 2) hint = `<span class="hint skip">${esc(t("hintSkip"))}</span>`;
  else if (q.difficulty <= 2 && q.importance >= 4) hint = `<span class="hint win">${esc(t("hintWin"))}</span>`;
  const meta = [catTag(q.cat),
    q.est ? `<span class="tag">${ICON_CLOCK}${esc(fmtMin(remainingMin(q)))}</span>` : "",
    q.repeat !== "none" ? `<span class="tag">${ICON_REPEAT}${esc(L().rep[q.repeat])}</span>` : ""].join("");
  const n = q.subtasks.length, dn = q.subtasks.filter(s => s.done).length, open = state.openSubs.has(q.id);
  const subs = n ? `<div class="subs">
      <button type="button" class="subs-toggle" data-act="subs-toggle" data-id="${esc(q.id)}" aria-expanded="${open}">
        <span class="prog"><i style="width:${(dn / n) * 100}%"></i></span><span>${esc(t("subProgress", dn, n))}</span>${ICON_CHEV}
      </button>
      ${open ? `<ul class="sub-list">${q.subtasks.map(s => `<li><label class="${s.done ? "done" : ""}"><input type="checkbox" data-sub="${esc(s.id)}" data-id="${esc(q.id)}" ${s.done ? "checked" : ""}><span>${esc(s.text)}</span></label></li>`).join("")}</ul>` : ""}
    </div>` : "";
  return `<article class="card ${overdue ? "is-overdue" : ""} ${state.highlight === q.id ? "flash" : ""}" data-id="${esc(q.id)}">
    <div class="card-head">
      <button type="button" class="card-title" data-act="open-q" data-id="${esc(q.id)}">${esc(q.title)}</button>
      <div class="badges">
        ${ext ? `<span class="badge muted">${esc(t("extended", ext))}</span>` : ""}
        ${overdue ? `<span class="badge bad">${esc(t("overdueBadge"))}</span>` : planPassed ? `<span class="bang" title="${esc(t("planPassedTitle"))}" aria-label="${esc(t("planPassedTitle"))}">!</span>` : ""}
        <button type="button" class="icon-btn sm edit-btn" data-act="edit" data-id="${esc(q.id)}" aria-label="${esc(t("editBtn"))}" title="${esc(t("editBtn"))}">${ICON_EDIT}</button>
      </div>
    </div>
    ${meta ? `<div class="meta">${meta}</div>` : ""}
    ${q.desc ? `<p class="desc">${esc(q.desc)}</p>` : ""}
    <dl class="dates">
      <div class="${overdue ? "bad" : ""}"><dt>${esc(t("due"))}</dt><dd>${esc(fmt(q.due))} <span class="rel">${esc(dueRel)}</span></dd></div>
      <div class="${planPassed ? "warn" : ""}"><dt>${esc(t("plan"))}</dt><dd>${planPassed ? '<span class="bang sm" aria-hidden="true">!</span>' : ""}${esc(fmt(q.plan))} <span class="rel">${esc(planRel)}</span></dd></div>
    </dl>
    ${subs}
    <div class="ratings">
      <span class="rating"><span class="r-label">${esc(t("diff"))}</span>${bars("diff", q.difficulty)}<span class="r-val">${esc(L().diffLabels[q.difficulty - 1] || "")}</span></span>
      <span class="rating"><span class="r-label">${esc(t("imp"))}</span>${bars("imp", q.importance)}<span class="r-val">${esc(L().impLabels[q.importance - 1] || "")}</span></span>
      ${hint}
    </div>
    <div class="actions">
      <button type="button" class="btn gold" data-act="complete" data-id="${esc(q.id)}">${ICON_CHECK}${esc(t("complete"))}</button>
      <button type="button" class="btn ghost" data-act="dates" data-id="${esc(q.id)}">${ICON_CAL}${esc(t("changeDates"))}</button>
      <button type="button" class="btn ghost danger" data-act="giveup" data-id="${esc(q.id)}">${ICON_FLAG}${esc(t("giveUp"))}</button>
    </div>
  </article>`;
}

function weekStrip() {
  const td = today(), cap = state.settings.capacity;
  const days = Array.from({ length: 7 }, (_, i) => addDays(td, i));
  return `<div class="week-wrap"><p class="week-label">${esc(t("weekLoad"))}</p><div class="week" role="group">${days.map(d => {
    const load = dayLoad(d), over = cap > 0 && load > cap;
    const h = cap > 0 ? Math.min(100, (load / cap) * 80) : (load ? 50 : 0);
    return `<button type="button" class="day ${over ? "over" : ""} ${d === td ? "today" : ""}" data-act="day" data-d="${d}" aria-pressed="${state.dayFilter === d}" aria-label="${esc(fmtLong(d))}${load ? ", " + esc(fmtMin(load)) : ""}">
      <span class="d-name">${esc(fmt(d, { weekday: "short" }))}</span>
      <span class="d-num">${parseD(d).getDate()}</span>
      <span class="d-bar"><b></b><i style="height:${h}%"></i></span>
      <span class="d-load">${load ? esc(fmtMin(load)) : "–"}</span>
    </button>`;
  }).join("")}</div></div>`;
}

function renderQuests() {
  if (!state.loaded && state.sync === "pending") return `<div class="empty"><p>${esc(t("loading"))}</p></div>`;
  const allActive = state.quests.filter(q => q.status === "active");
  if (!allActive.length) {
    return `<div class="empty">
      <svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 3 41 9v13c0 11-7.4 19.4-17 23C14.4 41.4 7 33 7 22V9z" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/><path d="M24 16v16M16 24h16" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>
      <h2>${esc(t("emptyTitle"))}</h2>
      <p>${esc(t("emptyBody"))}</p>
      ${state.sync === "off" ? "" : `<button type="button" class="btn gold" data-act="new">${esc(t("newQuest"))}</button>`}
    </div>`;
  }
  const td = today();
  const cats = state.settings.categories;
  if (state.catFilter !== "all" && state.catFilter !== "none" && !catById(state.catFilter)) state.catFilter = "all";
  let active = allActive.filter(matches);
  if (state.catFilter === "none") active = active.filter(q => !catById(q.cat));
  else if (state.catFilter !== "all") active = active.filter(q => q.cat === state.catFilter);
  if (state.dayFilter) active = active.filter(q => effDay(q) === state.dayFilter);

  const nOver = allActive.filter(q => td > q.due).length;
  const nPlan = allActive.filter(q => td <= q.due && q.plan && td > q.plan).length;
  const sorts = [["due", "sortDue"], ["plan", "sortPlan"], ["imp", "sortImp"], ["diff", "sortDiff"]];
  const hasUncat = allActive.some(q => !catById(q.cat));
  const catFilters = cats.length ? `<div class="filter" role="group" aria-label="${esc(t("category"))}">
      <button type="button" data-act="catf" data-c="all" aria-pressed="${state.catFilter === "all"}">${esc(t("allCats"))}</button>
      ${cats.map(c => `<button type="button" data-act="catf" data-c="${esc(c.id)}" aria-pressed="${state.catFilter === c.id}"><i class="dot" style="--c:var(--cat${c.color % 8})"></i>${esc(c.name)}</button>`).join("")}
      ${hasUncat ? `<button type="button" data-act="catf" data-c="none" aria-pressed="${state.catFilter === "none"}">${esc(t("uncategorized"))}</button>` : ""}
    </div>` : "";

  const weekEnd = addDays(weekStart(td), 6);
  const groups = { today: [], week: [], later: [] };
  for (const q of active) {
    const d = effDay(q);
    if (td > q.due || d === td) groups.today.push(q);
    else if (d <= weekEnd) groups.week.push(q);
    else groups.later.push(q);
  }
  const cap = state.settings.capacity;
  const todayLoad = dayLoad(td);
  const groupHtml = [["today", "groupToday"], ["week", "groupWeek"], ["later", "groupLater"]].filter(([k]) => groups[k].length).map(([k, lbl]) => {
    let side = `${groups[k].length}`;
    if (k === "today" && todayLoad) side = `<span class="${cap && todayLoad > cap ? "over" : ""}">${esc(cap ? t("loadOf", fmtMin(todayLoad), fmtMin(cap)) : t("loadOnly", fmtMin(todayLoad)))}</span>`;
    return `<section class="group"><div class="group-head"><h2>${esc(t(lbl))}</h2><span>${side}</span></div>
      <div class="list">${sortQuests(groups[k]).map(questCard).join("")}</div></section>`;
  }).join("");

  return `<div class="bar">
      <button type="button" class="now-btn" data-act="suggest">${ICON_COMPASS}${esc(t("whatNow"))}</button>
      <div class="summary">
        <span class="chip">${esc(t("activeN", allActive.length))}</span>
        ${nOver ? `<span class="chip bad">${esc(t("overdueN", nOver))}</span>` : ""}
        ${nPlan ? `<span class="chip warn">! ${esc(t("planN", nPlan))}</span>` : ""}
      </div>
    </div>
    ${weekStrip()}
    <div class="controls">
      ${catFilters}
      <div class="sort" role="group" aria-label="${esc(t("sortBy"))}">
        <span>${esc(t("sortBy"))}</span>
        ${sorts.map(([k, lbl]) => `<button type="button" data-act="sort" data-sort="${k}" aria-pressed="${state.sort === k}">${esc(t(lbl))}</button>`).join("")}
      </div>
      ${state.dayFilter ? `<div><span class="chip">${esc(t("dayFilter", fmt(state.dayFilter)))} · <button type="button" data-act="day-clear">${esc(t("clear"))}</button></span></div>` : ""}
    </div>
    ${groupHtml || `<div class="empty"><p>${esc(state.q.trim() ? t("noResults", state.q.trim()) : t("emptyFiltered"))}</p></div>`}`;
}

/* ---------- calendar ----------
   Shapes, not colours, carry the meaning: square = due date (tinted with the subject's colour),
   gold ring = day you plan to do it, ✓ = finished that day. */
function calMaps() {
  const dueMap = {}, planMap = {}, doneMap = {};
  const push = (map, k, q) => { (map[k] = map[k] || []).push(q); };
  for (const q of state.quests) {
    if (q.status === "active") { push(dueMap, q.due, q); if (q.plan) push(planMap, q.plan, q); }
    else if (q.status === "done") push(doneMap, q.doneDate, q);
  }
  return { dueMap, planMap, doneMap };
}
function calMark(kind, q) {
  if (kind === "done") return `<span class="ch-mk done" aria-hidden="true">✓</span>`;
  if (kind === "plan") return `<span class="ch-mk plan" aria-hidden="true"></span>`;
  const c = catById(q?.cat), late = q && today() > q.due;
  return `<span class="ch-mk due ${late ? "late" : ""}" ${c ? `style="--c:var(--cat${c.color % 8})"` : ""} aria-hidden="true"></span>`;
}
function calChip(kind, q) {
  const c = catById(q.cat), late = kind === "due" && today() > q.due;
  return `<span class="ch ${kind} ${late ? "late" : ""}" ${c ? `style="--c:var(--cat${c.color % 8})"` : ""}>${calMark(kind, q)}<span class="ch-t">${esc(q.title)}</span></span>`;
}
function calHead(title) {
  const v = state.calView;
  return `<div class="cal-head">
      <h2>${esc(title)}</h2>
      <div class="cal-nav">
        <div class="seg" role="group" aria-label="${esc(t("tabCal"))}">
          <button type="button" data-act="cal-view" data-v="month" aria-pressed="${v === "month"}">${esc(t("calMonthView"))}</button>
          <button type="button" data-act="cal-view" data-v="list" aria-pressed="${v === "list"}">${esc(t("calListView"))}</button>
        </div>
        <button type="button" class="icon-btn" data-act="cal-prev" aria-label="${esc(t("calPrev"))}">${ICON_LEFT}</button>
        <button type="button" class="btn small" data-act="cal-today">${esc(t("calToday"))}</button>
        <button type="button" class="icon-btn" data-act="cal-next" aria-label="${esc(t("calNext"))}">${ICON_RIGHT}</button>
      </div>
    </div>`;
}
const calLegend = () => `<div class="cal-legend">
    <span>${calMark("due")}${esc(t("legendDue"))}</span>
    <span>${calMark("plan")}${esc(t("legendPlan"))}</span>
    <span>${calMark("done")}${esc(t("legendDone"))}</span>
  </div>`;
function calRow(kind, q) {
  const td = today();
  const pill = kind === "done" ? `<span class="pill ${esc(q.timing)}">${esc(timingText(q))}</span>`
    : kind === "due" && td > q.due ? `<span class="badge bad">${esc(t("overdueBadge"))}</span>` : "";
  const label = { due: t("lblDue"), plan: t("lblPlan"), done: t("lblDone") }[kind];
  return `<button type="button" class="dp-item ag-row" data-act="open-q" data-id="${esc(q.id)}">
    <span class="ag-kind">${calMark(kind, q)}${esc(label)}</span>
    <span class="ag-title">${catDot(q.cat)}${esc(q.title)}</span>${pill}</button>`;
}
function renderCalendar() {
  if (!state.loaded && state.sync === "pending") return `<div class="empty"><p>${esc(t("loading"))}</p></div>`;
  const td = today();
  const [y, m] = state.calMonth.split("-").map(Number);
  const first = `${y}-${pad(m)}-01`, last = toStr(new Date(y, m, 0));
  const { dueMap, planMap, doneMap } = calMaps();
  const monthName = parseD(first).toLocaleDateString(locale(), { month: "long", year: "numeric" });
  const addBtn = state.sync === "on" ? `<div><button type="button" class="btn small" data-act="cal-add">+ ${esc(t("calAdd"))}</button></div>` : "";

  if (state.calView === "list") {
    let days = "";
    for (let d = first; d <= last; d = addDays(d, 1)) {
      const rows = [...(dueMap[d] || []).map(q => calRow("due", q)), ...(planMap[d] || []).map(q => calRow("plan", q)), ...(doneMap[d] || []).map(q => calRow("done", q))];
      if (!rows.length) continue;
      const rel = diffDays(td, d);
      days += `<section class="ag-day ${d === td ? "today" : ""}" ${d === td ? 'id="ag-today"' : ""}>
        <div class="ag-head"><b>${esc(fmtLong(d))}</b><span>${esc(t("rel", rel))}</span></div>
        ${rows.join("")}
      </section>`;
    }
    return calHead(monthName) + calLegend() + (days ? `<div class="agenda">${days}</div>` : `<div class="empty"><p>${esc(t("calMonthEmpty"))}</p>${addBtn}</div>`);
  }

  const start = weekStart(first), end = addDays(weekStart(last), 6);
  const wdNames = Array.from({ length: 7 }, (_, i) => fmt(addDays("2024-01-01", i), { weekday: "short" }));
  let cells = "";
  for (let d = start; d <= end; d = addDays(d, 1)) {
    const out = d.slice(0, 7) !== state.calMonth;
    const chips = [...(dueMap[d] || []).map(q => calChip("due", q)), ...(planMap[d] || []).map(q => calChip("plan", q)), ...(doneMap[d] || []).map(q => calChip("done", q))];
    const shown = chips.slice(0, 3).join("") + (chips.length > 3 ? `<span class="ch more">+${chips.length - 3}</span>` : "");
    const dues = (dueMap[d] || []).length, plans = (planMap[d] || []).length, dones = (doneMap[d] || []).length;
    const label = [fmtLong(d), dues ? `${t("legendDue")} ${dues}` : "", plans ? `${t("legendPlan")} ${plans}` : "", dones ? `${t("legendDone")} ${dones}` : ""].filter(Boolean).join(", ");
    cells += `<button type="button" class="cal-day ${out ? "out" : ""} ${d === td ? "today" : ""}" data-act="cal-day" data-d="${d}" aria-pressed="${state.calDay === d}" aria-label="${esc(label)}">
      <span class="cd-n">${parseD(d).getDate()}</span><span class="cd-chips">${shown}</span></button>`;
  }
  const sel = state.calDay;
  const secDue = dueMap[sel] || [], secPlan = planMap[sel] || [], secDone = doneMap[sel] || [];
  return calHead(monthName) + `
    <div class="cal-grid">${wdNames.map(n => `<div class="cal-wd">${esc(n)}</div>`).join("")}${cells}</div>
    ${calLegend()}
    <section class="day-panel">
      <h3>${esc(fmtLong(sel))}</h3>
      ${[...secDue.map(q => calRow("due", q)), ...secPlan.map(q => calRow("plan", q)), ...secDone.map(q => calRow("done", q))].join("") || `<p class="help">${esc(t("calEmpty"))}</p>`}
      ${addBtn}
    </section>`;
}

/* ---------- stats ---------- */
function donut(segments, small) {
  const total = segments.reduce((a, s) => a + s.n, 0);
  const r = 52, c = 2 * Math.PI * r, cx = 66, cy = 66, sw = 16;
  let rings = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="var(--pip-off)" stroke-width="${sw}"/>`;
  if (total) {
    const nonzero = segments.filter(s => s.n > 0).length;
    const gap = nonzero > 1 ? 3 : 0;
    let acc = 0;
    for (const s of segments) {
      if (!s.n) continue;
      const len = (s.n / total) * c;
      const draw = Math.max(0.01, len - gap);
      rings += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${s.color}" stroke-width="${sw}" stroke-dasharray="${draw} ${c - draw}" stroke-dashoffset="${-acc}" transform="rotate(-90 ${cx} ${cy})"/>`;
      acc += len;
    }
  }
  return `<svg class="donut" viewBox="0 0 132 132" role="img" aria-label="${esc(segments.map(s => `${s.label} ${pct(s.n, total)}%`).join(", "))}">
    ${rings}
    <text class="c-big" x="${cx}" y="${cy + 6}" text-anchor="middle">${total}</text>
    <text class="c-small" x="${cx}" y="${cy + 24}" text-anchor="middle">${esc(small)}</text>
  </svg>`;
}
function legend(segments) {
  const total = segments.reduce((a, s) => a + s.n, 0);
  return `<ul class="legend">${segments.map(s => `<li><span class="sw" style="background:${s.color}"></span><span>${esc(s.label)}</span><span class="pct">${pct(s.n, total)}%<span class="cnt">${s.n}</span></span></li>`).join("")}</ul>`;
}

function renderBadges() {
  const stats = badgeStats(), got = state.settings.badges;
  const earned = BADGES.filter(b => got[b.id]).length;
  return `<section class="chart-card" style="margin-top:12px" id="badges">
    <h3>${esc(t("badgesTitle"))}</h3><p class="sub">${esc(t("badgesSub", earned, BADGES.length))}</p>
    <div class="badge-grid">${BADGES.map(b => {
      const [name, desc] = badgeText(b);
      const on = !!got[b.id], have = Math.min(stats[b.stat] || 0, b.need);
      return `<div class="bdg ${on ? "" : "locked"}">${medal(b.icon)}<b>${esc(name)}</b><p>${esc(desc)}</p>
        ${on ? `<small>${esc(t("badgeEarned", fmt(got[b.id], { day: "numeric", month: "short", year: "numeric" })))}</small>`
             : b.need > 1 ? `<span class="prog"><i style="width:${(have / b.need) * 100}%"></i></span><small>${have}/${b.need}</small>` : ""}
      </div>`;
    }).join("")}</div>
  </section>`;
}

function renderStats() {
  if (!state.loaded && state.sync === "pending") return `<div class="empty"><p>${esc(t("loading"))}</p></div>`;
  const periods = [["week", "thisWeek"], ["month", "thisMonth"], ["year", "thisYear"], ["all", "allTime"]];
  const done = state.quests.filter(q => q.status === "done");
  const tiles = periods.map(([p, lbl]) => {
    const n = done.filter(q => inRange(q.doneDate, periodRange(p))).length;
    return `<button type="button" class="tile" data-act="period" data-p="${p}" aria-pressed="${state.period === p}">
      <span class="tile-l">${esc(t(lbl))}</span><span class="tile-n">${n}</span><span class="tile-s">${esc(t("completedWord"))}</span></button>`;
  }).join("");

  const r = periodRange(state.period);
  const doneP = done.filter(q => inRange(q.doneDate, r));
  const failedP = state.quests.filter(q => q.status === "failed" && inRange(q.failedDate, r));
  const timingSegs = [
    { label: t("early"), n: doneP.filter(q => q.timing === "early").length, color: "var(--blue)" },
    { label: t("ontime"), n: doneP.filter(q => q.timing === "ontime").length, color: "var(--ok)" },
    { label: t("late"), n: doneP.filter(q => q.timing === "late").length, color: "var(--bad)" }
  ];
  const entered = state.quests.filter(q => inRange(q.createdDate, r));
  const statusSegs = [
    { label: t("sDone"), n: entered.filter(q => q.status === "done").length, color: "var(--gold)" },
    { label: t("sFailed"), n: entered.filter(q => q.status === "failed").length, color: "var(--bad)" },
    { label: t("sActive"), n: entered.filter(q => q.status === "active").length, color: "var(--open)" }
  ];
  const resolved = doneP.length + failedP.length;
  const st = streaks();

  const groups = new Map();
  for (const q of [...doneP, ...failedP]) {
    const key = catById(q.cat) ? q.cat : "";
    if (!groups.has(key)) groups.set(key, { done: [], failed: 0 });
    const g = groups.get(key);
    if (q.status === "done") g.done.push(q); else g.failed++;
  }
  const catRows = [...groups.entries()].sort((a, b) => (b[1].done.length + b[1].failed) - (a[1].done.length + a[1].failed)).map(([key, g]) => {
    const c = catById(key);
    const e = g.done.filter(q => q.timing === "early").length, o = g.done.filter(q => q.timing === "ontime").length, l = g.done.filter(q => q.timing === "late").length;
    const tot = g.done.length + g.failed;
    const seg = (n, color) => n ? `<i style="flex:${n};background:${color}"></i>` : "";
    const line = t("catLine", g.done.length, pct(l, g.done.length), g.failed);
    return `<div class="cat-row">
      <div class="cat-row-top"><strong>${c ? `<i class="dot" style="--c:var(--cat${c.color % 8})"></i>${esc(c.name)}` : esc(t("uncategorized"))}</strong><span>${esc(line)}</span></div>
      <div class="stack" role="img" aria-label="${esc(line)}">${tot ? seg(e, "var(--blue)") + seg(o, "var(--ok)") + seg(l, "var(--bad)") + seg(g.failed, "var(--open)") : ""}</div>
    </div>`;
  }).join("");

  return `<div class="tiles" role="group">${tiles}</div>
    <div class="mini-stats">
      <span class="chip">${esc(t("totalXp", totalXp()))}</span>
      <span class="chip">${esc(t("bestStreak", st.best))}</span>
      <button type="button" class="btn small" data-act="summary">${esc(t("summaryBtn"))}</button>
    </div>
    ${resolved ? `<p class="rate-line">${t("rateLine", pct(doneP.length, resolved), failedP.length)}</p>` : ""}
    <div class="charts">
      <section class="chart-card">
        <h3>${esc(t("timingTitle"))}</h3><p class="sub">${esc(t("timingSub"))}</p>
        ${doneP.length ? `<div class="donut-wrap">${donut(timingSegs, t("completedWord"))}${legend(timingSegs)}</div>` : `<p class="nodata">${esc(t("noData"))}</p>`}
      </section>
      <section class="chart-card">
        <h3>${esc(t("statusTitle"))}</h3><p class="sub">${esc(state.period === "all" ? t("statusSubAll") : t("statusSubPeriod"))}</p>
        ${entered.length ? `<div class="donut-wrap">${donut(statusSegs, t("questsWord"))}${legend(statusSegs)}</div>` : `<p class="nodata">${esc(t("noData"))}</p>`}
      </section>
    </div>
    <section class="chart-card" style="margin-top:12px">
      <h3>${esc(t("byCat"))}</h3><p class="sub">${esc(t("byCatSub"))}</p>
      ${catRows ? `<div class="cat-rows">${catRows}</div>
        <div class="c-legend"><span><i style="background:var(--blue)"></i>${esc(t("early"))}</span><span><i style="background:var(--ok)"></i>${esc(t("ontime"))}</span><span><i style="background:var(--bad)"></i>${esc(t("late"))}</span><span><i style="background:var(--open)"></i>${esc(t("sFailed"))}</span></div>`
        : `<p class="nodata">${esc(t("noData"))}</p>`}
    </section>
    ${renderBadges()}`;
}

function renderHistory() {
  if (!state.loaded && state.sync === "pending") return `<div class="empty"><p>${esc(t("loading"))}</p></div>`;
  const filters = [["all", "hAll"], ["done", "hDone"], ["failed", "hFailed"]];
  let items = state.quests.filter(q => q.status !== "active").filter(matches);
  if (state.hist !== "all") items = items.filter(q => q.status === state.hist);
  items.sort((a, b) => ((b.doneDate || b.failedDate || "").localeCompare(a.doneDate || a.failedDate || "")) || ((b.resolvedAt || 0) - (a.resolvedAt || 0)));
  const head = `<div class="filter" role="group" style="margin-bottom:14px">${filters.map(([k, l]) => `<button type="button" data-act="hist" data-h="${k}" aria-pressed="${state.hist === k}">${esc(t(l))}</button>`).join("")}</div>`;
  if (!items.length) return head + `<div class="empty"><p>${esc(state.q.trim() ? t("noResults", state.q.trim()) : t("histEmpty"))}</p></div>`;
  return head + `<div class="hist">${items.map(q => {
    const isDone = q.status === "done";
    const meta = isDone ? `${t("finishedOn")} ${fmt(q.doneDate)} · ${t("due")} ${fmt(q.due)}` : `${t("failedOn")} ${fmt(q.failedDate)} · ${t("due")} ${fmt(q.due)}`;
    const xp = questXp(q);
    const pills = isDone
      ? `<span class="pill ${esc(q.timing)}">${esc(timingText(q))}</span>${q.forgot ? `<span class="pill note">${esc(t("forgotTag"))}</span>` : ""}<span class="pill xp">+${xp} XP</span>`
      : `<span class="pill failed">${esc(t("failedPill"))}</span><span class="pill xp-loss">−${-xp} XP</span>`;
    return `<button type="button" class="hist-item" data-act="detail" data-id="${esc(q.id)}">
      <span class="hi-main"><span class="hi-title">${catDot(q.cat)}${esc(q.title)}</span><span class="hi-meta">${esc(meta)}</span></span>
      <span class="pills">${pills}</span></button>`;
  }).join("")}</div>`;
}

/* ---------- sheets ---------- */
function planChips(target) {
  const td = today();
  const next = dow => { const d = parseD(td); return addDays(td, (dow - d.getDay() + 7) % 7); };
  const cands = [[td, t("today")], [addDays(td, 1), t("tomorrow")], [next(6), null], [next(0), null]];
  const seen = new Set();
  return cands.filter(([d]) => !seen.has(d) && seen.add(d)).map(([d, lbl]) => {
    const label = lbl || fmt(d, { weekday: "long" });
    return `<button type="button" data-act="chip" data-target="${target}" data-date="${d}">${esc(label)} · ${esc(fmt(d, { day: "numeric", month: "short" }))}</button>`;
  }).join("");
}
function pipInput(field, kind, v) {
  const labels = kind === "diff" ? L().diffLabels : L().impLabels;
  return `<div class="pip-input ${kind}" data-field="${field}" data-v="${v}" role="radiogroup">
    <div class="pip-btns">${[1, 2, 3, 4, 5].map(i => `<button type="button" class="pip-btn ${i <= v ? "on" : ""}" data-act="pip" data-pv="${i}" role="radio" aria-checked="${i === v}" aria-label="${esc(labels[i - 1])}"><i style="--h:${i}"></i></button>`).join("")}</div>
    <span class="pip-text">${esc(labels[v - 1])}</span></div>`;
}
function catPicker(selected) {
  const cats = state.settings.categories;
  return `<button type="button" data-act="cat-pick" data-c="" aria-pressed="${!catById(selected)}">${esc(t("noCat"))}</button>
    ${cats.map(c => `<button type="button" data-act="cat-pick" data-c="${esc(c.id)}" aria-pressed="${selected === c.id}"><i class="dot" style="--c:var(--cat${c.color % 8})"></i>${esc(c.name)}</button>`).join("")}
    <button type="button" data-act="cat-new">+ ${esc(t("newCat"))}</button>`;
}
const stRow = s => `<div class="st-row ${s.done ? "done" : ""}" data-sid="${esc(s.id)}" data-done="${s.done ? 1 : 0}"><input type="text" class="st-text" value="${esc(s.text)}" maxlength="200" aria-label="${esc(t("subtasks"))}"><button type="button" class="icon-btn sm" data-act="st-remove" aria-label="${esc(t("removeCat"))}">×</button></div>`;

function questForm(q, preset = {}) {
  const isNew = !q;
  const estH = q?.est ? +(q.est / 60).toFixed(2) : "";
  return `<h2>${esc(isNew ? t("newQuest") : t("editTitle"))}</h2>
  <form id="qform" novalidate>
    <label class="field"><span>${esc(t("fTitle"))}</span><input type="text" id="f-title" maxlength="140" placeholder="${esc(t("fTitlePh"))}" value="${esc(q?.title || "")}" autocomplete="off"></label>
    <label class="field"><span>${esc(t("fDesc"))}</span><textarea id="f-desc" rows="3" maxlength="2000" placeholder="${esc(t("fDescPh"))}">${esc(q?.desc || "")}</textarea></label>
    <div class="field"><span class="field-label">${esc(t("category"))}</span>
      <div class="cat-pick" id="cat-pick" data-v="${esc(catById(q?.cat) ? q.cat : "")}">${catPicker(q?.cat)}</div>
      <div class="inline-add" id="cat-new" hidden><input type="text" id="cat-name" maxlength="40" placeholder="${esc(t("catPh"))}" aria-label="${esc(t("category"))}"><button type="button" class="btn small" data-act="cat-add">${esc(t("addCat"))}</button></div>
    </div>
    ${isNew ? `
    <div class="row2">
      <label class="field"><span>${esc(t("fDue"))}</span><input type="date" id="f-due" value="${esc(preset.due || "")}"></label>
      <label class="field"><span>${esc(t("fPlan"))}</span><input type="date" id="f-plan" value="${esc(preset.plan || "")}"></label>
    </div>
    <div class="quick">${planChips("f-plan")}</div>` : `
    <dl class="readonly">
      <div><dt>${esc(t("due"))}</dt><dd>${esc(fmt(q.due))}</dd></div>
      <div><dt>${esc(t("plan"))}</dt><dd>${esc(fmt(q.plan))}</dd></div>
    </dl>`}
    <div class="field"><span class="field-label">${esc(t("est"))}</span>
      <div class="est-row"><input type="number" id="f-est" min="0" max="24" step="0.25" inputmode="decimal" value="${estH}" aria-label="${esc(t("est"))}"><span>${esc(t("estHours"))}</span></div>
    </div>
    <div class="quick">${[0.25, 0.5, 1, 1.5, 2, 3].map(h => `<button type="button" data-act="est-chip" data-h="${h}">${esc(fmtMin(h * 60))}</button>`).join("")}</div>
    <p class="warn-text" id="load-warn" role="status"></p>
    <div class="field"><span class="field-label">${esc(t("diff"))}</span>${pipInput("difficulty", "diff", q?.difficulty || 3)}</div>
    <div class="field"><span class="field-label">${esc(t("imp"))}</span>${pipInput("importance", "imp", q?.importance || 3)}</div>
    <div class="field"><span class="field-label">${esc(t("subtasks"))}</span>
      <div class="st-list" id="st-list">${(q?.subtasks || []).map(stRow).join("")}</div>
      <div class="inline-add" style="margin-top:0"><input type="text" id="st-new" maxlength="200" placeholder="${esc(t("subPh"))}" aria-label="${esc(t("subtasks"))}"><button type="button" class="btn small" data-act="st-add">${esc(t("addSub"))}</button></div>
    </div>
    <label class="field"><span>${esc(t("repeat"))}</span>
      <select id="f-repeat">${Object.entries(L().rep).map(([k, v]) => `<option value="${k}" ${(q?.repeat || "none") === k ? "selected" : ""}>${esc(v)}</option>`).join("")}</select>
    </label>
    <p class="help" id="repeat-note" ${(q?.repeat || "none") === "none" ? "hidden" : ""} style="margin:-6px 0 14px">${esc(t("repeatNote"))}</p>
    <p class="err" id="f-err" role="alert"></p>
    <div class="sheet-actions">
      ${isNew ? "" : `<button type="button" class="btn ghost" data-act="dates" data-id="${esc(q.id)}" style="margin-right:auto">${ICON_CAL}${esc(t("changeDates"))}</button>`}
      <button type="button" class="btn ghost" data-act="close">${esc(t("cancel"))}</button>
      <button type="submit" class="btn primary">${esc(isNew ? t("addQuest") : t("save"))}</button>
    </div>
    ${isNew ? "" : `<p style="margin:18px 0 0"><button type="button" class="link" data-act="del">${esc(t("deleteQuest"))}</button></p>`}
  </form>`;
}

function updateLoadWarn() {
  const el = $("#load-warn"); if (!el) return;
  const s = state.sheet;
  const q = s && s.qid ? byId(s.qid) : null;
  const plan = $("#f-plan") ? $("#f-plan").value : q?.plan;
  const h = parseFloat($("#f-est")?.value);
  const cap = state.settings.capacity;
  el.textContent = "";
  if (!isDate(plan) || !(h > 0) || !cap) return;
  const day = plan < today() ? today() : plan;
  const total = dayLoad(day, q?.id) + h * 60;
  if (total > cap) el.textContent = t("loadWarn", fmtLong(day), fmtMin(total), fmtMin(cap));
}

function deleteConfirm(q) {
  return `<h2>${esc(t("deleteQ", q.title))}</h2><p class="lead">${esc(t("deleteQBody"))}</p>
    <div class="sheet-actions"><button type="button" class="btn ghost" data-act="close">${esc(t("cancel"))}</button>
    <button type="button" class="btn danger-solid" data-act="del-yes">${esc(t("deleteYes"))}</button></div>`;
}

/* compact quick look at one quest (opened from the calendar and from notifications) */
function peekView(q) {
  const td = today(), active = q.status === "active";
  const overdue = active && td > q.due, planPassed = active && !!q.plan && td > q.plan;
  const c = catById(q.cat);
  const n = q.subtasks.length, dn = q.subtasks.filter(s => s.done).length;
  const fact = (label, value, cls = "") => `<div class="pk-f ${cls}"><dt>${esc(label)}</dt><dd>${value}</dd></div>`;
  const status = q.status === "done"
    ? `<span class="pill ${esc(q.timing)}">${esc(timingText(q))}</span>`
    : q.status === "failed" ? `<span class="pill failed">${esc(t("failedPill"))}</span>`
    : overdue ? `<span class="badge bad">${esc(t("overdueBadge"))}</span>`
    : planPassed ? `<span class="bang" title="${esc(t("planPassedTitle"))}">!</span>` : "";
  const est = q.est ? (n && dn ? `${esc(fmtMin(q.est))} <span class="pk-sub">${esc(t("pkLeft", fmtMin(remainingMin(q))))}</span>` : esc(fmtMin(q.est))) : "—";
  const facts = [
    fact(t("due"), `${esc(fmt(q.due))} <span class="pk-sub">${esc(active ? (overdue ? t("overdueBy", diffDays(q.due, td)) : t("rel", diffDays(td, q.due))) : "")}</span>`, overdue ? "bad" : ""),
    fact(t("plan"), `${esc(fmt(q.plan))} <span class="pk-sub">${esc(active && q.plan ? t("rel", diffDays(td, q.plan)) : "")}</span>`, planPassed ? "warn" : ""),
    fact(t("category"), c ? `<i class="dot" style="--c:var(--cat${c.color % 8})"></i>${esc(c.name)}` : "—"),
    fact(t("est"), est),
    fact(t("diff"), `${bars("diff", q.difficulty)} ${esc(L().diffLabels[q.difficulty - 1] || "")}`),
    fact(t("imp"), `${bars("imp", q.importance)} ${esc(L().impLabels[q.importance - 1] || "")}`),
    fact(t("repeat"), q.repeat !== "none" ? `${ICON_REPEAT}${esc(L().rep[q.repeat])}` : esc(L().rep.none)),
    q.status === "done" ? fact(t("finishedOn"), esc(fmt(q.doneDate))) : q.status === "failed" ? fact(t("failedOn"), esc(fmt(q.failedDate))) : ""
  ].join("");
  const subs = n ? `<div class="pk-subs"><p class="sec-label">${esc(t("subProgress", dn, n))}</p>
      <ul class="sub-list">${q.subtasks.map(s => `<li><label class="${s.done ? "done" : ""}"><input type="checkbox" data-sub="${esc(s.id)}" data-id="${esc(q.id)}" ${s.done ? "checked" : ""} ${active ? "" : "disabled"}><span>${esc(s.text)}</span></label></li>`).join("")}</ul></div>` : "";
  const actions = active
    ? `<button type="button" class="btn ghost" data-act="edit" data-id="${esc(q.id)}">${ICON_EDIT}${esc(t("editBtn"))}</button>
       <button type="button" class="btn gold" data-act="complete" data-id="${esc(q.id)}">${ICON_CHECK}${esc(t("complete"))}</button>`
    : `<button type="button" class="btn ghost" data-act="close">${esc(t("close"))}</button>
       <button type="button" class="btn" data-act="detail" data-id="${esc(q.id)}">${esc(t("pkDetails"))}</button>`;
  return `<span class="grab" aria-hidden="true"></span>
    <div class="pk-head"><h2>${esc(q.title)}</h2>${status}</div>
    ${q.desc ? `<p class="pk-desc">${esc(q.desc)}</p>` : ""}
    <dl class="pk-grid">${facts}</dl>
    ${subs}
    <div class="sheet-actions pk-actions">${actions}</div>`;
}

function detailView(q) {
  const isDone = q.status === "done";
  const exts = (q.extensions || []).filter(e => e.toDue !== e.fromDue);
  const xp = questXp(q);
  const statusPill = isDone
    ? `<span class="pill ${esc(q.timing)}">${esc(timingText(q))}</span>${q.forgot ? ` <span class="pill note">${esc(t("forgotTag"))}</span>` : ""} <span class="pill xp">+${xp} XP</span>`
    : `<span class="pill failed">${esc(t("failedPill"))}</span> <span class="pill xp-loss">−${-xp} XP</span>`;
  const meta = [catTag(q.cat), q.est ? `<span class="tag">${ICON_CLOCK}${esc(fmtMin(q.est))}</span>` : "", q.repeat !== "none" ? `<span class="tag">${ICON_REPEAT}${esc(L().rep[q.repeat])}</span>` : ""].join("");
  return `<h2>${esc(q.title)}</h2>
    ${meta ? `<div class="meta" style="margin:4px 0 12px">${meta}</div>` : ""}
    ${q.desc ? `<p class="lead" style="white-space:pre-wrap;overflow-wrap:anywhere">${esc(q.desc)}</p>` : ""}
    <dl class="readonly">
      <div><dt>${esc(t("due"))}</dt><dd>${esc(fmt(q.due))}</dd></div>
      <div><dt>${esc(t("plan"))}</dt><dd>${esc(fmt(q.plan))}</dd></div>
      <div><dt>${esc(isDone ? t("finishedOn") : t("failedOn"))}</dt><dd>${esc(fmt(isDone ? q.doneDate : q.failedDate))}</dd></div>
      <div><dt>${esc(t("added"))}</dt><dd>${esc(fmt(q.createdDate))}</dd></div>
    </dl>
    <div class="summary-box"><span>${esc(t("status"))}</span><span>${statusPill}</span></div>
    <div class="ratings" style="margin-bottom:14px">
      <span class="rating"><span class="r-label">${esc(t("diff"))}</span>${bars("diff", q.difficulty)}<span class="r-val">${esc(L().diffLabels[q.difficulty - 1] || "")}</span></span>
      <span class="rating"><span class="r-label">${esc(t("imp"))}</span>${bars("imp", q.importance)}<span class="r-val">${esc(L().impLabels[q.importance - 1] || "")}</span></span>
    </div>
    ${q.subtasks.length ? `<p class="sec-label">${esc(t("subProgress", q.subtasks.filter(s => s.done).length, q.subtasks.length))}</p><ul class="ext-list">${q.subtasks.map(s => `<li${s.done ? ' style="text-decoration:line-through"' : ""}>${esc(s.text)}</li>`).join("")}</ul>` : ""}
    ${exts.length ? `<p class="sec-label">${esc(t("dateChanges"))}</p><ul class="ext-list">${exts.map(e => `<li>${esc(t("extLine", fmt(e.at), fmt(e.fromDue), fmt(e.toDue)))}</li>`).join("")}</ul>` : ""}
    <div class="sheet-actions">
      <button type="button" class="link" data-act="del" style="margin-right:auto">${esc(t("deleteQuest"))}</button>
      <button type="button" class="btn" data-act="reopen">${esc(t("reopen"))}</button>
      <button type="button" class="btn primary" data-act="close">${esc(t("close"))}</button>
    </div>`;
}
function reopenConfirm(q) {
  return `<h2>${esc(t("reopenQ", q.title))}</h2><p class="lead">${esc(t("reopenBody"))}</p>
    <div class="sheet-actions"><button type="button" class="btn ghost" data-act="close">${esc(t("cancel"))}</button>
    <button type="button" class="btn primary" data-act="reopen-yes">${esc(t("sure"))}</button></div>`;
}

function completeStep(q, s) {
  if (s.step === "confirm") {
    return `<h2>${esc(t("completeQ", q.title))}</h2><p class="lead">${esc(t("completeQBody"))}</p>
      <div class="sheet-actions"><button type="button" class="btn ghost" data-act="close">${esc(t("cancel"))}</button>
      <button type="button" class="btn gold" data-act="c-yes">${esc(t("sure"))}</button></div>`;
  }
  if (s.step === "overdue") {
    return `<h2>${esc(t("overdueQ"))}</h2><p class="lead">${esc(t("overdueQBody"))}</p>
      <div class="summary-box"><span>${esc(t("due"))}</span><strong>${esc(fmt(q.due))}</strong></div>
      <div class="choice">
        <button type="button" class="btn" data-act="c-mode" data-mode="late">${esc(t("optLate"))}</button>
        <button type="button" class="btn" data-act="c-mode" data-mode="forgot">${esc(t("optForgot"))}</button>
      </div>
      <div class="sheet-actions"><button type="button" class="btn ghost" data-act="close">${esc(t("cancel"))}</button></div>`;
  }
  if (s.step === "date") {
    const lim = dateLimits(q, s.mode);
    const val = s.doneDate || lim.def;
    return `<h2>${esc(t("whenDone"))}</h2><p class="lead">${esc(q.title)} · ${esc(t("due"))} ${esc(fmt(q.due))}</p>
      <label class="field"><span>${esc(t("finishedOn"))}</span><input type="date" id="c-date" value="${val}" ${lim.min ? `min="${lim.min}"` : ""} max="${lim.max}"></label>
      <div class="summary-box"><span id="c-preview">${previewTiming(q, s.mode, val)}</span></div>
      <p class="err" id="c-err" role="alert"></p>
      <div class="sheet-actions"><button type="button" class="btn ghost" data-act="close">${esc(t("cancel"))}</button>
      <button type="button" class="btn gold" data-act="c-next">${esc(t("next"))}</button></div>`;
  }
  const timing = s.mode === "forgot" ? "ontime" : classify(s.doneDate, q.due);
  const gain = xpFor(q.difficulty, q.importance, timing);
  return `<h2>${esc(q.title)}</h2>
    <div class="summary-box"><span>${esc(t("finishedOn"))} <strong>${esc(fmt(s.doneDate))}</strong></span><span><span class="pill ${timing}">${esc(timingText({ timing, doneDate: s.doneDate, due: q.due }))}</span> <span class="pill xp">+${gain} XP</span></span></div>
    <button type="button" class="big" data-act="c-big">${esc(t("bigComplete"))}</button>
    <p class="big-note">${esc(t("bigCompleteNote"))}</p>
    <div class="sheet-actions"><button type="button" class="btn ghost" data-act="close">${esc(t("cancel"))}</button></div>`;
}
function dateLimits(q, mode) {
  const td = today();
  if (mode === "late") return { min: addDays(q.due, 1), max: td, def: td };
  if (mode === "forgot") return { min: null, max: q.due < td ? q.due : td, def: q.due < td ? q.due : td };
  return { min: null, max: td, def: td };
}
function previewTiming(q, mode, val) {
  if (!isDate(val)) return "";
  if (mode === "forgot") return `<span class="pill ontime">${esc(t("timingOntime"))}</span> <span style="color:var(--muted);font-size:13px">${esc(t("forgotNote"))}</span>`;
  const timing = classify(val, q.due);
  return `<span class="pill ${timing}">${esc(timingText({ timing, doneDate: val, due: q.due }))}</span> <span class="pill xp">+${xpFor(q.difficulty, q.importance, timing)} XP</span>`;
}

function giveupStep(q, s) {
  if (s.step === "confirm") {
    return `<h2>${esc(t("giveUpQ", q.title))}</h2><p class="lead">${esc(t("giveUpQBody"))}</p>
      <div class="summary-box"><span>XP</span><span class="pill xp-loss">−${failCost(q.importance)} XP</span></div>
      <div class="sheet-actions"><button type="button" class="btn primary" data-act="close">${esc(t("keepGoing"))}</button>
      <button type="button" class="btn ghost danger" data-act="g-yes">${esc(t("sure"))}</button></div>`;
  }
  return `<h2>${esc(q.title)}</h2><p class="lead">${esc(t("lastChance"))}</p>
    <button type="button" class="big fail" data-act="g-big">${esc(t("bigGiveUp"))}</button>
    <div class="sheet-actions"><button type="button" class="btn primary wide" data-act="close">${esc(t("keepGoing"))}</button></div>`;
}

function datesStep(q, s) {
  if (s.step === "confirm") {
    return `<h2>${esc(t("changeQ", q.title))}</h2><p class="lead">${esc(t("changeQBody"))}</p>
      <div class="sheet-actions"><button type="button" class="btn ghost" data-act="close">${esc(t("cancel"))}</button>
      <button type="button" class="btn primary" data-act="d-yes">${esc(t("sure"))}</button></div>`;
  }
  return `<h2>${esc(t("changeDates"))}</h2><p class="lead">${esc(q.title)}</p>
    <form id="dform" novalidate>
      <dl class="readonly">
        <div><dt>${esc(t("currentDue"))}</dt><dd>${esc(fmt(q.due))}</dd></div>
        <div><dt>${esc(t("currentPlan"))}</dt><dd>${esc(fmt(q.plan))}</dd></div>
      </dl>
      <div class="row2">
        <label class="field"><span>${esc(t("newDue"))}</span><input type="date" id="d-due" value="${esc(q.due)}"></label>
        <label class="field"><span>${esc(t("newPlan"))}</span><input type="date" id="d-plan" max="${esc(q.due)}"></label>
      </div>
      <div class="quick">${planChips("d-plan")}</div>
      <p class="err" id="d-err" role="alert"></p>
      <div class="sheet-actions"><button type="button" class="btn ghost" data-act="close">${esc(t("cancel"))}</button>
      <button type="submit" class="btn primary">${esc(t("saveDates"))}</button></div>
    </form>`;
}

/* "what should I do now?" */
function score(q) {
  const td = today(), dd = diffDays(td, q.due);
  let s = q.importance * 1.6;
  s += dd < 0 ? 9 : dd === 0 ? 8 : 8 / (dd + 1);
  if (q.plan && q.plan <= td) s += 3;
  if (q.difficulty <= 2 && q.importance >= 4) s += 1;
  return s;
}
function reasons(q) {
  const td = today(), dd = diffDays(td, q.due), out = [];
  if (dd < 0) out.push(["bad", t("rOverdue")]);
  else if (dd === 0) out.push(["bad", t("rDueToday")]);
  else if (dd === 1) out.push(["warn", t("rDueTomorrow")]);
  else if (dd <= 4) out.push(["", t("rDueSoon", dd)]);
  if (q.plan && q.plan < td) out.push(["warn", t("rPlanPassed")]);
  else if (q.plan === td) out.push(["", t("rPlanned")]);
  if (q.importance >= 4) out.push(["", t("rImportant")]);
  if (q.difficulty <= 2 && q.importance >= 4) out.push(["", t("rQuick")]);
  return out;
}
function suggestView(s) {
  const list = state.quests.filter(q => q.status === "active").sort((a, b) => score(b) - score(a));
  if (!list.length) return `<h2>${esc(t("whatNow"))}</h2><p class="lead">${esc(t("suggestNone"))}</p>
    <div class="sheet-actions"><button type="button" class="btn primary" data-act="close">${esc(t("close"))}</button></div>`;
  const q = list[s.idx % list.length];
  s.current = q.id;
  const meta = [catTag(q.cat), q.est ? `<span class="tag">${ICON_CLOCK}${esc(fmtMin(remainingMin(q)))}</span>` : ""].join("");
  return `<h2>${esc(t("suggestTitle"))}</h2>
    <div class="suggest-card">
      <h3>${esc(q.title)}</h3>
      ${meta ? `<div class="meta">${meta}</div>` : ""}
      <div class="ratings">
        <span class="rating"><span class="r-label">${esc(t("due"))}</span><span class="r-val">${esc(fmt(q.due))}</span></span>
        <span class="rating"><span class="r-label">${esc(t("imp"))}</span>${bars("imp", q.importance)}</span>
        <span class="rating"><span class="r-label">${esc(t("diff"))}</span>${bars("diff", q.difficulty)}</span>
      </div>
    </div>
    <div class="reasons">${reasons(q).map(([k, r]) => `<span class="chip ${k}">${esc(r)}</span>`).join("")}</div>
    <div class="sheet-actions">
      ${list.length > 1 ? `<button type="button" class="btn ghost" data-act="suggest-next">${esc(t("suggestNext"))}</button>` : ""}
      <button type="button" class="btn gold" data-act="suggest-go">${esc(t("suggestStart"))}</button>
    </div>`;
}

/* weekly summary */
function weekSummary(ws) {
  const r = [ws, addDays(ws, 6)];
  const done = state.quests.filter(q => q.status === "done" && inRange(q.doneDate, r));
  const failed = state.quests.filter(q => q.status === "failed" && inRange(q.failedDate, r));
  const late = done.filter(q => q.timing === "late").length;
  const early = done.filter(q => q.timing === "early").length;
  const xp = done.reduce((a, q) => a + questXp(q), 0) + failed.reduce((a, q) => a + questXp(q), 0);
  const per = {};
  done.forEach(q => { if (!catById(q.cat)) return; (per[q.cat] = per[q.cat] || { d: 0, bad: 0 }).d++; if (q.timing === "late") per[q.cat].bad++; });
  failed.forEach(q => { if (!catById(q.cat)) return; (per[q.cat] = per[q.cat] || { d: 0, bad: 0 }).bad++; });
  const entries = Object.entries(per);
  const best = entries.filter(([, v]) => v.d > 0).sort((a, b) => b[1].d - a[1].d)[0];
  const weak = entries.filter(([, v]) => v.bad > 0).sort((a, b) => b[1].bad - a[1].bad)[0];
  const badges = Object.values(state.settings.badges).filter(d => inRange(d, r)).length;
  const goal = state.settings.dailyGoal;
  const perDay = {};
  done.forEach(q => { perDay[q.doneDate] = (perDay[q.doneDate] || 0) + 1; });
  const goalDays = goal > 0 ? Object.values(perDay).filter(n => n >= goal).length : 0;
  return { r, done: done.length, failed: failed.length, late, early, xp, best: best && catById(best[0]), weak: weak && catById(weak[0]), badges, goalDays };
}
function summaryView(s) {
  const w = weekSummary(s.ws);
  const range = `${fmt(w.r[0], { day: "numeric", month: "short" })} – ${fmt(w.r[1], { day: "numeric", month: "short" })}`;
  let tip;
  if (!w.done && !w.failed) tip = t("tipStart");
  else if (w.done && pct(w.late, w.done) >= 30) tip = t("tipLate", pct(w.late, w.done));
  else if (w.failed) tip = t("tipFail", w.failed);
  else tip = t("tipGreat");
  const lines = [
    w.best ? t("sumBest", w.best.name) : "",
    w.weak && (!w.best || w.weak.id !== w.best.id) ? t("sumWeak", w.weak.name) : "",
    w.goalDays ? t("sumGoal", w.goalDays) : "",
    w.badges ? t("sumBadges", w.badges) : ""
  ].filter(Boolean);
  return `<h2>${esc(t("summaryTitle"))}</h2><p class="lead">${esc(range)}</p>
    ${w.done || w.failed ? `<div class="sum-grid">
      <div><b>${w.done}</b><span>${esc(t("sumDone"))}</span></div>
      <div><b>${w.early}</b><span>${esc(t("sumEarly"))}</span></div>
      <div><b>${w.late}</b><span>${esc(t("sumLate"))}</span></div>
      <div><b>${w.failed}</b><span>${esc(t("sumFailed"))}</span></div>
      <div><b>${w.xp >= 0 ? "+" : "−"}${Math.abs(w.xp)}</b><span>${esc(t("sumXp"))}</span></div>
    </div>
    ${lines.length ? `<ul class="sum-lines">${lines.map(l => `<li>${esc(l)}</li>`).join("")}</ul>` : ""}` : `<p class="help" style="margin-bottom:14px">${esc(t("sumEmpty"))}</p>`}
    <p class="tip">${esc(tip)}</p>
    <div class="sheet-actions"><button type="button" class="btn gold" data-act="close">${esc(t("sumGreat"))}</button></div>`;
}

/* settings */
function settingsView(s) {
  return `<h2>${esc(t("settings"))}</h2>
    <form id="sform" novalidate>
      <div class="row2">
        <label class="field"><span>${esc(t("capacity"))}</span><input type="number" id="s-cap" min="0" max="24" step="0.5" inputmode="decimal" value="${+(state.settings.capacity / 60).toFixed(2)}"></label>
        <label class="field"><span>${esc(t("dailyGoal"))}</span><input type="number" id="s-goal" min="0" max="20" step="1" inputmode="numeric" value="${state.settings.dailyGoal}"></label>
      </div>
      <p class="help" style="margin:-6px 0 6px">${esc(t("capacityHelp"))}</p>
      <p class="help" style="margin:0 0 18px">${esc(t("dailyGoalHelp"))}</p>
      <p class="sec-label">${esc(t("manageCats"))}</p>
      <div id="s-cats">${s.draft.length ? s.draft.map(c => `<div class="set-cat" data-cid="${esc(c.id)}"><i class="dot" style="--c:var(--cat${c.color % 8})"></i><input type="text" value="${esc(c.name)}" maxlength="40" aria-label="${esc(t("category"))}"><button type="button" class="btn small ghost danger" data-act="s-cat-remove">${esc(t("removeCat"))}</button></div>`).join("") : `<p class="help" style="margin-bottom:8px">${esc(t("noCats"))}</p>`}</div>
      <div class="inline-add"><input type="text" id="s-cat-new" maxlength="40" placeholder="${esc(t("catPh"))}" aria-label="${esc(t("category"))}"><button type="button" class="btn small" data-act="s-cat-add">${esc(t("addCat"))}</button></div>
      <div class="sheet-actions"><button type="button" class="btn ghost" data-act="close">${esc(t("cancel"))}</button>
      <button type="submit" class="btn primary">${esc(t("save"))}</button></div>
    </form>
    <div class="sec-gap">
      <p class="sec-label">${esc(t("backup"))}</p>
      <p class="help" style="margin-bottom:10px">${esc(t("backupHelp"))}</p>
      <div class="actions">
        <button type="button" class="btn small" data-act="backup">${esc(t("backupDownload"))}</button>
        <label class="btn small file-btn">${esc(t("backupRestore"))}<input type="file" id="restore-file" accept=".json,application/json"></label>
      </div>
    </div>
    <div class="sec-gap">
      <p class="sec-label">${esc(t("account"))}</p>
      <p class="help" style="margin-bottom:10px">${esc(t("signedInAs", currentUser?.email || currentUser?.displayName || ""))}</p>
      <div class="actions">
        ${installEvt ? `<button type="button" class="btn small gold" data-act="install">${esc(t("install"))}</button>` : ""}
        <button type="button" class="btn small ghost danger" data-act="signout">${esc(t("signOut"))}</button>
      </div>
    </div>`;
}
function readSettingsDraft() {
  const s = state.sheet;
  document.querySelectorAll("#s-cats .set-cat").forEach(row => {
    const c = s.draft.find(x => x.id === row.dataset.cid);
    if (c) c.name = row.querySelector("input").value.trim() || c.name;
  });
  s.capInput = $("#s-cap")?.value;
  s.goalInput = $("#s-goal")?.value;
}
function nextColor(list) {
  const used = new Set(list.map(c => c.color % 8));
  for (let i = 0; i < 8; i++) if (!used.has(i)) return i;
  return list.length % 8;
}
function restoreView(s) {
  return `<h2>${esc(t("restoreQ", s.items.length))}</h2><p class="lead">${esc(t("restoreBody"))}</p>
    <div class="sheet-actions"><button type="button" class="btn ghost" data-act="close">${esc(t("cancel"))}</button>
    <button type="button" class="btn primary" data-act="restore-yes">${esc(t("sure"))}</button></div>`;
}

function renderSheet() {
  const s = state.sheet, scrim = $("#scrim"), sheet = $("#sheet");
  if (!s) { scrim.hidden = true; sheet.innerHTML = ""; return; }
  const q = s.qid ? byId(s.qid) : null;
  if (s.qid && !q) { state.sheet = null; scrim.hidden = true; return; }
  let html = "";
  if (s.kind === "new") html = questForm(null, s.preset);
  else if (s.kind === "edit") html = s.step === "delete" ? deleteConfirm(q) : questForm(q);
  else if (s.kind === "detail") html = s.step === "delete" ? deleteConfirm(q) : s.step === "reopen" ? reopenConfirm(q) : detailView(q);
  else if (s.kind === "complete") html = completeStep(q, s);
  else if (s.kind === "giveup") html = giveupStep(q, s);
  else if (s.kind === "dates") html = datesStep(q, s);
  else if (s.kind === "suggest") html = suggestView(s);
  else if (s.kind === "settings") html = settingsView(s);
  else if (s.kind === "summary") html = summaryView(s);
  else if (s.kind === "restore") html = restoreView(s);
  else if (s.kind === "inbox") html = inboxView(s);
  else if (s.kind === "peek") html = peekView(q);
  sheet.className = "sheet" + (s.kind === "peek" ? " peek" : "");
  sheet.innerHTML = html;
  if (s.kind === "settings") {
    if (s.capInput != null && $("#s-cap")) $("#s-cap").value = s.capInput;
    if (s.goalInput != null && $("#s-goal")) $("#s-goal").value = s.goalInput;
  }
  scrim.hidden = false;
  sheet.scrollTop = 0;
  updateLoadWarn();
  const focusEl = sheet.querySelector("#f-title, #d-plan, #c-date, .big, .sheet-actions .btn:last-child");
  if (focusEl) setTimeout(() => focusEl.focus({ preventScroll: true }), 30);
}
const openSheet = s => { state.sheet = s; renderSheet(); };
const closeSheet = () => { state.sheet = null; renderSheet(); };

/* ---------- toast ---------- */
let toastTimer;
function toast(msg) {
  const el = $("#toast");
  el.textContent = msg; el.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { el.hidden = true; }, 3200);
}

/* ---------- writes (Firestore keeps write order and works offline) ---------- */
async function write(fn) {
  if (!col) { toast(t("syncOff")); return false; }
  try { await fn(); return true; }
  catch (e) {
    console.error(e);
    toast(e && e.code === "resource-exhausted" ? t("quota") : t("saveErr"));
    return false;
  }
}
const enqueue = (key, fn) => write(fn);
const settingsData = () => ({ categories: state.settings.categories, capacity: state.settings.capacity, dailyGoal: state.settings.dailyGoal, badges: state.settings.badges, lastSummary: state.settings.lastSummary });
/* merge a patch into the settings doc (creating it when missing); nested maps such as badges merge key by key */
function saveSettings(patch) {
  return write(() => settingsRef.merge(patch || settingsData()));
}

function readSubtasks() {
  return [...document.querySelectorAll("#st-list .st-row")].map(r => ({
    id: r.dataset.sid, text: r.querySelector(".st-text").value.trim(), done: r.dataset.done === "1"
  })).filter(s => s.text);
}
function addSubtaskRow() {
  const inp = $("#st-new"); const text = inp.value.trim();
  if (!text) return;
  $("#st-list").insertAdjacentHTML("beforeend", stRow({ id: uid(), text, done: false }));
  inp.value = ""; inp.focus();
}

function submitQuest() {
  const s = state.sheet;
  const err = $("#f-err");
  const title = $("#f-title").value.trim();
  const desc = $("#f-desc").value.trim();
  const difficulty = +document.querySelector('[data-field="difficulty"]').dataset.v;
  const importance = +document.querySelector('[data-field="importance"]').dataset.v;
  const cat = $("#cat-pick").dataset.v || null;
  const estH = parseFloat($("#f-est").value);
  const est = estH > 0 ? Math.min(24 * 60, Math.round(estH * 60)) : 0;
  if ($("#st-new").value.trim()) addSubtaskRow();
  const subtasks = readSubtasks();
  const repeat = $("#f-repeat").value;
  if (!title) { err.textContent = t("errTitle"); $("#f-title").focus(); return; }
  if (s.kind === "new") {
    const due = $("#f-due").value, plan = $("#f-plan").value;
    if (!isDate(due)) { err.textContent = t("errDue"); $("#f-due").focus(); return; }
    if (!isDate(plan)) { err.textContent = t("errPlan"); $("#f-plan").focus(); return; }
    if (plan > due) { err.textContent = t("errPlanAfter"); $("#f-plan").focus(); return; }
    if (!col) { toast(t("syncOff")); return; }
    const ref = col.doc();
    const data = { title, desc, cat, est, subtasks, repeat, seriesId: repeat !== "none" ? ref.id : null, due, plan, difficulty, importance, status: "active", createdDate: today(), createdAt: Date.now(), extensions: [] };
    closeSheet();
    enqueue(ref.id, () => ref.set(data));
  } else {
    const q = byId(s.qid);
    const patch = { title, desc, cat, est, subtasks, repeat, difficulty, importance };
    if (repeat !== "none" && !q.seriesId) patch.seriesId = q.id;
    closeSheet();
    enqueue(q.id, () => col.doc(q.id).update(patch)).then(ok => { if (ok) { toast(t("saved")); if (repeat !== "none") maintain(); } });
  }
}

function submitDates() {
  const q = byId(state.sheet.qid);
  const err = $("#d-err");
  const due = $("#d-due").value, plan = $("#d-plan").value;
  if (!isDate(due)) { err.textContent = t("errDue"); $("#d-due").focus(); return; }
  if (!isDate(plan)) { err.textContent = t("errNewPlan"); $("#d-plan").focus(); return; }
  if (plan > due) { err.textContent = t("errPlanAfter"); $("#d-plan").focus(); return; }
  const extensions = (q.extensions || []).concat([{ at: today(), fromDue: q.due, toDue: due, fromPlan: q.plan || null, toPlan: plan }]);
  closeSheet();
  enqueue(q.id, () => col.doc(q.id).update({ due, plan, extensions })).then(ok => ok && toast(t("saved")));
}

function submitSettings() {
  readSettingsDraft();
  const s = state.sheet;
  const capH = parseFloat($("#s-cap").value);
  const goal = parseInt($("#s-goal").value, 10);
  state.settings = {
    ...state.settings,
    categories: s.draft.filter(c => c.name),
    capacity: capH >= 0 ? Math.round(capH * 60) : state.settings.capacity,
    dailyGoal: goal >= 0 ? Math.min(20, goal) : state.settings.dailyGoal
  };
  closeSheet();
  render();
  saveSettings({ categories: state.settings.categories, capacity: state.settings.capacity, dailyGoal: state.settings.dailyGoal }).then(ok => ok && toast(t("saved")));
}

function doComplete() {
  const s = state.sheet, q = byId(s.qid);
  const timing = s.mode === "forgot" ? "ontime" : classify(s.doneDate, q.due);
  const gain = xpFor(q.difficulty, q.importance, timing);
  const goal = state.settings.dailyGoal;
  const hitsGoal = goal > 0 && s.doneDate === today() && doneOn(today()) + 1 === goal;
  const bonus = hitsGoal ? GOAL_BONUS : 0;
  const before = levelInfo(totalXp()).lvl;
  const after = levelInfo(totalXp() + gain + bonus).lvl;
  const data = { status: "done", doneDate: s.doneDate, timing, forgot: s.mode === "forgot", xp: gain, goalBonus: bonus || null, resolvedAt: Date.now() };
  const weekN = weekDoneCount() + (inRange(s.doneDate, periodRange("week")) ? 1 : 0);
  closeSheet();
  celebrate("win", {
    title: q.title,
    pills: `<span class="pill ${timing}">${esc(timingText({ timing, doneDate: s.doneDate, due: q.due }))}</span>${bonus ? `<span class="pill ontime">${esc(t("goalDone"))}</span>` : ""}`,
    xp: `+${gain + bonus} XP`, line: t("weekLine", weekN),
    level: after > before ? t("levelText", after, lvTitle(after)) : ""
  });
  enqueue(q.id, () => col.doc(q.id).update(data)).then(ok => {
    if (!ok) return;
    checkBadges(true);
    spawnNext({ ...q, ...data });
  });
}

function doFail() {
  const q = byId(state.sheet.qid);
  const cost = failCost(q.importance);
  const done = state.quests.filter(x => x.status === "done").length;
  const failed = state.quests.filter(x => x.status === "failed").length + 1;
  const lines = L().failLines;
  closeSheet();
  celebrate("fail", { title: q.title, pills: "", xp: `−${cost} XP`, line: `${lines[Math.floor(Math.random() * lines.length)]} ${t("successRate", pct(done, done + failed))}`, level: "" });
  const data = { status: "failed", failedDate: today(), xpLoss: cost, resolvedAt: Date.now() };
  enqueue(q.id, () => col.doc(q.id).update(data)).then(ok => ok && spawnNext({ ...q, ...data }));
}

function doDelete() {
  const q = byId(state.sheet.qid);
  closeSheet();
  enqueue(q.id, () => col.doc(q.id).delete()).then(ok => ok && toast(t("deleted")));
}

function doReopen() {
  const q = byId(state.sheet.qid);
  closeSheet();
  enqueue(q.id, () => col.doc(q.id).update({ status: "active", doneDate: null, timing: null, forgot: false, failedDate: null, xp: null, xpLoss: null, goalBonus: null, resolvedAt: null }))
    .then(ok => ok && toast(t("reopened")));
}

function toggleSub(qid, sid, checked) {
  const q = byId(qid); if (!q) return;
  const subtasks = q.subtasks.map(s => s.id === sid ? { ...s, done: checked } : s);
  q.subtasks = subtasks;
  if (checked) sfx("pop");
  render();
  if (state.sheet?.kind === "peek") { const y = $("#sheet").scrollTop; renderSheet(); $("#sheet").scrollTop = y; }
  enqueue(qid, () => col.doc(qid).update({ subtasks }));
}

/* ---------- badges ---------- */
function checkBadges(announce) {
  if (!settingsRef) return;
  const stats = badgeStats(), got = state.settings.badges, td = today();
  const fresh = BADGES.filter(b => !got[b.id] && (stats[b.stat] || 0) >= b.need);
  if (!fresh.length) return;
  const patch = {};
  fresh.forEach(b => { patch[b.id] = td; });
  state.settings = { ...state.settings, badges: { ...got, ...patch } };
  saveSettings({ badges: patch });
  render();
  if (announce) fresh.forEach(b => {
    const [name, desc] = badgeText(b);
    celebrate("badge", { title: name, pills: "", xp: "", line: desc, level: "", icon: b.icon });
  });
}

/* ---------- backup ---------- */
function doBackup() {
  const data = JSON.stringify({ app: "quest-log", version: 1, exportedAt: new Date().toISOString(), settings: settingsData(), quests: state.quests }, null, 2);
  try {
    const url = URL.createObjectURL(new Blob([data], { type: "application/json" }));
    const a = document.createElement("a");
    a.href = url; a.download = `quest-log-${today()}.json`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 10000);
    toast(t("backupSaved"));
  } catch { toast(t("backupUnavailable")); }
}
function readBackupFile(file) {
  const reader = new FileReader();
  reader.onload = () => {
    let parsed = null;
    try { parsed = JSON.parse(String(reader.result)); } catch {}
    if (!parsed || parsed.app !== "quest-log" || !Array.isArray(parsed.quests)) { toast(t("backupBad")); return; }
    const items = parsed.quests.filter(q => q && typeof q === "object" && typeof q.title === "string")
      .map(q => ({ id: typeof q.id === "string" && ID_RE.test(q.id) ? q.id : col.doc().id, data: q }));
    openSheet({ kind: "restore", items, settings: parsed.settings || null });
  };
  reader.onerror = () => toast(t("backupBad"));
  reader.readAsText(file);
}
async function doRestore() {
  const s = state.sheet;
  closeSheet();
  let n = 0;
  for (const it of s.items) {
    const { id, ...body } = normalize(it.id, it.data);
    const ok = await enqueue(it.id, () => col.doc(it.id).set(body));
    if (ok) n++;
  }
  if (s.settings) {
    const incoming = normalizeSettings(s.settings);
    const cats = [...state.settings.categories];
    incoming.categories.forEach(c => { if (!cats.some(x => x.id === c.id)) cats.push(c); });
    state.settings = { ...state.settings, categories: cats, badges: { ...incoming.badges, ...state.settings.badges } };
    await saveSettings({ categories: cats, badges: state.settings.badges });
  }
  toast(t("restored", n));
}

/* ---------- recurring quests ---------- */
const spawning = new Set();
async function spawnNext(q) {
  if (!col || !q || q.repeat === "none" || q.nextId || spawning.has(q.id)) return;
  spawning.add(q.id);
  const td = today();
  let nextDue = stepDate(q.due, q.repeat);
  let guard = 0;
  while (nextDue < td && guard++ < 400) nextDue = stepDate(nextDue, q.repeat);
  const offset = q.plan ? Math.max(0, diffDays(q.plan, q.due)) : 0;
  let nextPlan = addDays(nextDue, -offset);
  if (nextPlan < td) nextPlan = td > nextDue ? nextDue : td;
  const seriesId = q.seriesId || q.id;
  const id = `${seriesId}-${nextDue.replace(/-/g, "")}`;
  const data = {
    title: q.title, desc: q.desc, cat: q.cat, est: q.est, difficulty: q.difficulty, importance: q.importance,
    subtasks: q.subtasks.map(s => ({ id: s.id, text: s.text, done: false })),
    repeat: q.repeat, seriesId, spawned: true, due: nextDue, plan: nextPlan,
    status: "active", createdDate: td, createdAt: Date.now(), extensions: []
  };
  const ref = col.doc(id);
  const ok = await enqueue(id, async () => { const snap = await ref.get(); if (!snap.exists) await ref.set(data); });
  if (ok) await enqueue(q.id, () => col.doc(q.id).update({ nextId: id }));
}
function maintain() {
  const td = today();
  for (const q of state.quests) {
    if (q.repeat !== "none" && !q.nextId && (q.status !== "active" || td > q.due)) spawnNext(q);
  }
}

/* ---------- in-app notifications ----------
   Generated from the quests whenever the app is open; stored in users/{uid}/meta/inbox
   as a map keyed by a stable id, so every device adds the same note only once and read state syncs. */
const svgI = d => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${d}"/></svg>`;
const NOTE_ICON = {
  daily: svgI("M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6 7 7M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0z"),
  plan: ICON_CAL, tomorrow: ICON_CLOCK, due: ICON_CLOCK, overdue: ICON_FLAG,
  streak: ICON_FLAME,
  goal: svgI("M20 12a8 8 0 1 1-16 0 8 8 0 0 1 16 0zM16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0z"),
  load: svgI("M12 4 2.5 20h19zM12 10v4.5M12 17.5v.01"),
  idle: svgI("M7 3h10M7 21h10M8 3c0 5 8 5 8 9s-8 4-8 9M16 3c0 5-8 5-8 9"),
  near: ICON_MEDAL, rec: ICON_REPEAT,
  weekly: svgI("M4 20V10M10 20V4M16 20v-7M22 20H2")
};
const NOTE_TONE = { overdue: "bad", due: "bad", tomorrow: "warn", streak: "warn", load: "warn", idle: "warn", goal: "ok", near: "ok", weekly: "ok" };
const QUEST_NOTES = ["plan", "tomorrow", "due", "overdue", "idle", "rec"];
const UNIT_OF = { streak: "day", goal: "day", level: "level" };

function normalizeInbox(d) {
  const out = {};
  const n = d && d.n && typeof d.n === "object" ? d.n : {};
  for (const [id, v] of Object.entries(n)) {
    if (!v || typeof v !== "object" || !NOTE_ICON[v.kind]) continue;
    out[id] = { kind: v.kind, day: isDate(v.day) ? v.day : today(), ts: Number(v.ts) || 0, read: !!v.read, qid: typeof v.qid === "string" ? v.qid : null, p: v.p && typeof v.p === "object" ? v.p : {} };
  }
  return out;
}
/* a note about a quest stops counting once that quest is done, given up, deleted or re-dated */
function noteLive(n) {
  if (QUEST_NOTES.includes(n.kind)) {
    const q = byId(n.qid);
    if (!q || q.status !== "active") return false;
    if ((n.kind === "tomorrow" || n.kind === "due" || n.kind === "overdue") && q.due !== n.p.due) return false;
    if (n.kind === "plan" && q.plan !== n.p.plan) return false;
    return true;
  }
  if (n.kind === "near") { const b = BADGES.find(x => x.id === n.p.b); return !!b && !state.settings.badges[b.id]; }
  if (n.kind === "load" && isDate(n.p.d) && n.p.d >= today()) return state.settings.capacity > 0 && dayLoad(n.p.d) > state.settings.capacity;
  if (n.kind === "goal" && n.day === today()) return state.settings.dailyGoal > 0 && state.settings.dailyGoal - doneOn(today()) > 0;
  return true;
}
function noteText(n) {
  const p = { ...n.p };
  const q = n.qid ? byId(n.qid) : null;
  if (q) p.t = q.title;
  if (n.kind === "load") {
    p.d = p.d === today() ? t("today").toLocaleLowerCase(locale()) : p.d === addDays(today(), 1) ? t("tomorrow").toLocaleLowerCase(locale()) : fmt(p.d);
    if (state.lang === "tr") p.d = p.d.charAt(0).toLocaleUpperCase("tr-TR") + p.d.slice(1);
    p.l = fmtMin(p.l); p.cap = fmtMin(p.cap);
  }
  if (n.kind === "goal" && n.day === today()) p.n = Math.max(1, state.settings.dailyGoal - doneOn(today()));
  if (n.kind === "near") {
    const b = BADGES.find(x => x.id === p.b);
    const left = b ? Math.max(1, b.need - (badgeStats()[b.stat] || 0)) : p.n;
    p.n = left; p.name = b ? badgeText(b)[0] : "";
    p.unit = L().units[UNIT_OF[b?.stat] || "quest"](left);
  }
  const fn = L().n[n.kind];
  return fn ? fn(p) : "";
}
const liveNotes = () => Object.entries(state.inbox || {}).map(([id, n]) => ({ id, ...n })).filter(noteLive).sort((a, b) => b.ts - a.ts);
const unreadCount = () => liveNotes().filter(n => !n.read).length;
function setAppBadge(n) {
  try {
    if (n > 0 && navigator.setAppBadge) navigator.setAppBadge(n).catch(() => {});
    else if (navigator.clearAppBadge) navigator.clearAppBadge().catch(() => {});
  } catch {}
}
function updateBell() {
  const n = currentUser ? unreadCount() : 0;
  const c = $("#bell-count"), b = $("#bell-btn");
  if (!c || !b) return;
  c.hidden = !n; c.textContent = n > 9 ? "9+" : String(n);
  b.setAttribute("aria-label", t("notesBell", n)); b.title = t("notesTitle");
  b.hidden = state.sync !== "on";
  setAppBadge(n);
}

function genNotifications() {
  if (!bootChecked || !inboxRef || state.sync !== "on") return;
  const td = today(), tm = addDays(td, 1), hour = new Date().getHours(), now = Date.now();
  const add = {};
  const push = (id, kind, extra = {}) => {
    if (state.inbox[id] || pendingNotes.has(id)) return;
    add[id] = { kind, day: td, ts: now + Object.keys(add).length, read: false, qid: extra.qid || null, p: extra.p || {} };
    pendingNotes.add(id);
  };
  const active = state.quests.filter(q => q.status === "active");

  // weekly first so the daily summary sits on top when both arrive together
  const lastWs = addDays(weekStart(td), -7), w = weekSummary(lastWs);
  if (w.done || w.failed) push(`weekly:${lastWs}`, "weekly", { p: { ws: lastWs } });

  active.filter(q => q.spawned && q.createdDate && diffDays(q.createdDate, td) <= 3).forEach(q => push(`rec:${q.id}`, "rec", { qid: q.id, p: { t: q.title } }));

  const bs = badgeStats();
  BADGES.forEach(b => {
    if (state.settings.badges[b.id] || b.need <= 1) return;
    const left = b.need - (bs[b.stat] || 0);
    if (left > 0 && left <= 2) push(`near:${b.id}`, "near", { p: { b: b.id, n: left } });
  });

  active.forEach(q => {
    if (!q.createdDate) return;
    const age = diffDays(q.createdDate, td);
    if (age >= 7 && (!q.plan || q.plan < td)) push(`idle:${q.id}:${Math.floor(age / 7)}`, "idle", { qid: q.id, p: { t: q.title, n: age } });
  });

  const cap = state.settings.capacity;
  if (cap) [td, tm, addDays(td, 2)].forEach(d => { const l = dayLoad(d); if (l > cap) push(`load:${d}`, "load", { p: { d, l: Math.round(l), cap } }); });

  const goal = state.settings.dailyGoal, got = doneOn(td), rem = goal - got;
  if (goal > 0 && rem > 0 && ((rem === 1 && got >= 1) || hour >= 17)) push(`goal:${td}`, "goal", { p: { n: rem } });

  const st = streaks();
  if (hour >= 18 && st.cur >= 2 && got === 0) push(`streak:${td}`, "streak", { p: { n: st.cur } });

  active.filter(q => q.due < td).forEach(q => push(`overdue:${q.id}:${q.due}`, "overdue", { qid: q.id, p: { t: q.title, due: q.due } }));
  active.filter(q => q.due === tm).forEach(q => push(`tomorrow:${q.id}:${q.due}`, "tomorrow", { qid: q.id, p: { t: q.title, due: q.due } }));
  active.filter(q => q.plan === td).forEach(q => push(`plan:${q.id}:${td}`, "plan", { qid: q.id, p: { t: q.title, plan: td } }));
  active.filter(q => q.due === td).forEach(q => push(`due:${q.id}:${q.due}`, "due", { qid: q.id, p: { t: q.title, due: q.due } }));

  const todays = sortQuests(active.filter(q => td > q.due || effDay(q) === td));
  push(`daily:${td}`, "daily", { p: { n: todays.length, items: todays.slice(0, 3).map(q => ({ t: q.title, last: q.due === td })) } });

  const patch = {};
  for (const [id, n] of Object.entries(add)) { patch[id] = n; state.inbox[id] = { ...n }; }
  for (const [id, n] of Object.entries(state.inbox)) if (now - n.ts > 21 * 864e5) { patch[id] = deleteField(); delete state.inbox[id]; }
  if (Object.keys(patch).length) inboxRef.merge({ n: patch }).catch(e => console.error(e));
  updateBell();
}
let notifyTimer = 0;
function scheduleNotify() { clearTimeout(notifyTimer); notifyTimer = setTimeout(genNotifications, 900); }

function inboxView(s) {
  const notes = liveNotes();
  if (!notes.length) return `<h2>${esc(t("notesTitle"))}</h2><p class="lead">${esc(t("notesEmpty"))}</p>
    <div class="sheet-actions"><button type="button" class="btn primary" data-act="close">${esc(t("close"))}</button></div>`;
  const td = today(), yd = addDays(td, -1);
  const item = n => {
    const unread = s.unread.has(n.id);
    const when = n.day === td ? t("today") : n.day === yd ? t("yesterday") : fmt(n.day);
    return `<button type="button" class="nt-item ${unread ? "unread" : ""}" data-act="nt-open" data-nid="${esc(n.id)}">
      <span class="nt-ic ${NOTE_TONE[n.kind] || ""}">${NOTE_ICON[n.kind]}</span>
      <span class="nt-body"><span class="nt-text">${esc(noteText(n))}</span><span class="nt-time">${esc(when)}</span></span>
      ${unread ? `<i class="nt-dot" aria-hidden="true"></i>` : ""}
    </button>`;
  };
  const fresh = notes.filter(n => s.unread.has(n.id)), old = notes.filter(n => !s.unread.has(n.id)).slice(0, 40);
  return `<h2>${esc(t("notesTitle"))}</h2>
    ${fresh.length ? `<p class="sec-label" style="margin-top:12px">${esc(t("notesNew"))}</p><div class="nt-list">${fresh.map(item).join("")}</div>` : ""}
    ${old.length ? `<p class="sec-label" style="margin-top:16px">${esc(t("notesOld"))}</p><div class="nt-list">${old.map(item).join("")}</div>` : ""}
    <div class="sheet-actions"><button type="button" class="btn primary" data-act="close">${esc(t("close"))}</button></div>`;
}
function openInbox() {
  genNotifications();
  const unread = liveNotes().filter(n => !n.read).map(n => n.id);
  openSheet({ kind: "inbox", unread: new Set(unread) });
  if (unread.length && inboxRef) {
    const patch = {};
    unread.forEach(id => { patch[id] = { read: true }; if (state.inbox[id]) state.inbox[id].read = true; });
    inboxRef.merge({ n: patch }).catch(e => console.error(e));
    updateBell();
  }
}
function openNote(id) {
  const n = state.inbox[id];
  closeSheet();
  if (!n) return;
  if (n.qid && byId(n.qid)) { openSheet({ kind: "peek", qid: n.qid }); return; }
  if (n.kind === "weekly") { openSheet({ kind: "summary", ws: n.p.ws }); return; }
  if (n.kind === "near") { handlers["goto-badges"](); return; }
  state.tab = "quests"; lsSet("ql-tab", "quests");
  state.dayFilter = n.kind === "load" && n.p.d >= today() ? n.p.d : null;
  render(); window.scrollTo({ top: 0 });
}

/* first load: recurring catch-up, silent badge sync, weekly summary */
function bootCheck() {
  if (bootChecked || !questsReady || !settingsReady || !inboxReady) return;
  bootChecked = true;
  maintain();
  checkBadges(false);
  genNotifications();
  const lastWs = addDays(weekStart(today()), -7);
  if (state.settings.lastSummary !== lastWs) {
    const w = weekSummary(lastWs);
    state.settings = { ...state.settings, lastSummary: lastWs };
    saveSettings({ lastSummary: lastWs });
    if ((w.done || w.failed) && !state.sheet && $("#ov").hidden) openSheet({ kind: "summary", ws: lastWs });
  }
}

/* ---------- celebration: overlay, particles ---------- */
let fxRaf = 0;
function burst(kind) {
  cancelAnimationFrame(fxRaf);
  const cv = $("#fx"), ctx = cv.getContext("2d");
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const W = cv.clientWidth, H = cv.clientHeight;
  cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, W, H);
  if (reducedMotion()) return;
  const parts = [];
  const win = kind !== "fail";
  const colors = win ? ["#F2C84B", "#FFE7A3", "#E8A317", "#FFFFFF", "#FFD1F0", "#9CD3FF"] : ["#FF6B5E", "#8C8C8C", "#5A5A5A", "#B9B4A6"];
  const spawn = (n, cx, cy, power) => {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, sp = power * (0.35 + Math.random() * 0.75);
      parts.push({ x: cx, y: cy, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - (win ? 3 : 0), g: win ? 0.16 : 0.12,
        s: 3 + Math.random() * 6, rot: Math.random() * 6, vr: (Math.random() - .5) * 0.4, life: 0, max: 110 + Math.random() * 90,
        c: colors[(Math.random() * colors.length) | 0], shape: Math.random() < 0.55 ? "rect" : "dot" });
    }
  };
  if (kind === "win") {
    setTimeout(() => spawn(170, W / 2, H * 0.42, Math.min(W, 900) / 50), 760);
    setTimeout(() => { spawn(60, W * 0.15, H * 0.9, 12); spawn(60, W * 0.85, H * 0.9, 12); }, 900);
  } else if (kind === "level" || kind === "badge") {
    setTimeout(() => spawn(160, W / 2, H * 0.45, Math.min(W, 900) / 50), kind === "badge" ? 500 : 0);
  } else {
    setTimeout(() => spawn(50, W / 2, H * 0.42, 7), 480);
  }
  const t0 = performance.now();
  const step = now => {
    ctx.clearRect(0, 0, W, H);
    for (const p of parts) {
      p.life++; p.vx *= 0.985; p.vy = p.vy * 0.985 + p.g; p.x += p.vx; p.y += p.vy; p.rot += p.vr;
      const alpha = Math.max(0, 1 - p.life / p.max);
      if (alpha <= 0) continue;
      ctx.globalAlpha = alpha; ctx.fillStyle = p.c;
      if (p.shape === "rect") { ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); ctx.restore(); }
      else { ctx.beginPath(); ctx.arc(p.x, p.y, p.s / 2.4, 0, Math.PI * 2); ctx.fill(); }
    }
    ctx.globalAlpha = 1;
    if (now - t0 < 4800) fxRaf = requestAnimationFrame(step); else ctx.clearRect(0, 0, W, H);
  };
  fxRaf = requestAnimationFrame(step);
}

let ovReadyAt = 0, levelTimer = 0;
const ovQueue = [];
function celebrate(kind, info) {
  const ov = $("#ov");
  if (!ov.hidden) { ovQueue.push([kind, info]); return; }
  ov.classList.toggle("is-fail", kind === "fail");
  ov.classList.toggle("is-badge", kind === "badge");
  $("#ov-kicker").textContent = kind === "badge" ? "BADGE" : "QUEST";
  $("#ov-title").textContent = kind === "fail" ? "FAILED" : kind === "badge" ? "UNLOCKED" : "COMPLETED";
  const mark = $("#ov-mark");
  if (kind === "badge") { mark.setAttribute("d", GLYPH[info.icon] || GLYPH.star); mark.setAttribute("transform", "translate(29 29) scale(2.25)"); }
  else { mark.setAttribute("d", kind === "fail" ? "M38 38 74 74M74 38 38 74" : "M34 58 50 73 79 41"); mark.removeAttribute("transform"); }
  $("#ov-quest").textContent = info.title;
  $("#ov-pills").innerHTML = info.pills || "";
  $("#ov-xp").textContent = info.xp || "";
  $("#ov-line").textContent = info.line || "";
  $("#ov-level").hidden = !info.level;
  $("#ov-level-text").textContent = info.level || "";
  $("#ov-continue").textContent = t("continue");
  ov.hidden = true; void ov.offsetWidth; ov.hidden = false;
  ovReadyAt = Date.now() + 1000;
  burst(kind);
  sfx(kind === "fail" ? "fail" : kind === "badge" ? "level" : "win");
  clearTimeout(levelTimer);
  if (info.level) levelTimer = setTimeout(() => { sfx("level"); burst("level"); }, 1900);
  try { navigator.vibrate && navigator.vibrate(kind === "fail" ? [120] : [30, 40, 60]); } catch {}
  setTimeout(() => $("#ov-continue").focus({ preventScroll: true }), 1600);
}
function closeOverlay() {
  $("#ov").hidden = true;
  clearTimeout(levelTimer);
  cancelAnimationFrame(fxRaf);
  if (ovQueue.length) { const [k, i] = ovQueue.shift(); setTimeout(() => celebrate(k, i), 250); }
}

/* ---------- events ---------- */
const handlers = {
  tab: el => { state.tab = el.dataset.tab; lsSet("ql-tab", state.tab); render(); window.scrollTo({ top: 0 }); },
  sort: el => { state.sort = el.dataset.sort; lsSet("ql-sort", state.sort); renderView(); },
  period: el => { state.period = el.dataset.p; lsSet("ql-period", state.period); renderView(); },
  hist: el => { state.hist = el.dataset.h; renderView(); },
  catf: el => { state.catFilter = el.dataset.c; lsSet("ql-cat", state.catFilter); renderView(); },
  day: el => { state.dayFilter = state.dayFilter === el.dataset.d ? null : el.dataset.d; renderView(); },
  "day-clear": () => { state.dayFilter = null; renderView(); },
  "q-clear": () => { state.q = ""; $("#q").value = ""; render(); $("#q").focus(); },
  lang: el => { state.lang = el.dataset.lang; lsSet("ql-lang", state.lang); render(); if (state.sheet) renderSheet(); },
  sound: () => { state.sound = !state.sound; lsSet("ql-sound", state.sound ? "1" : "0"); renderChrome(); if (state.sound) sfx("tick"); },
  settings: () => openSheet({ kind: "settings", draft: state.settings.categories.map(c => ({ ...c })) }),
  new: () => openSheet({ kind: "new", preset: {} }),
  edit: (el, id) => openSheet({ kind: "edit", qid: id }),
  detail: (el, id) => openSheet({ kind: "detail", qid: id }),
  "open-q": (el, id) => { if (byId(id)) openSheet({ kind: "peek", qid: id }); },
  complete: (el, id) => openSheet({ kind: "complete", qid: id, step: "confirm", mode: "normal" }),
  giveup: (el, id) => openSheet({ kind: "giveup", qid: id, step: "confirm" }),
  dates: (el, id) => openSheet({ kind: "dates", qid: id, step: "confirm" }),
  suggest: () => openSheet({ kind: "suggest", idx: 0 }),
  summary: () => openSheet({ kind: "summary", ws: addDays(weekStart(today()), -7) }),
  "goto-badges": () => {
    state.tab = "stats"; lsSet("ql-tab", "stats"); render();
    const el = $("#badges"); if (el) el.scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth", block: "start" });
  },
  "cal-day": el => { state.calDay = el.dataset.d; if (el.dataset.d.slice(0, 7) !== state.calMonth) state.calMonth = el.dataset.d.slice(0, 7); renderView(); },
  "cal-prev": () => { const [y, m] = state.calMonth.split("-").map(Number); const d = new Date(y, m - 2, 1); state.calMonth = toStr(d).slice(0, 7); state.calDay = toStr(d); renderView(); },
  "cal-next": () => { const [y, m] = state.calMonth.split("-").map(Number); const d = new Date(y, m, 1); state.calMonth = toStr(d).slice(0, 7); state.calDay = toStr(d); renderView(); },
  "cal-today": () => { state.calMonth = today().slice(0, 7); state.calDay = today(); renderView(); $("#ag-today")?.scrollIntoView({ block: "start", behavior: reducedMotion() ? "auto" : "smooth" }); },
  "cal-view": el => { state.calView = el.dataset.v === "list" ? "list" : "month"; lsSet("ql-calview", state.calView); renderView(); },
  "cal-add": () => { const d = state.calDay; openSheet({ kind: "new", preset: d >= today() ? { plan: d } : {} }); },
  "suggest-next": () => { state.sheet.idx++; sfx("tick"); renderSheet(); },
  "suggest-go": () => {
    const id = state.sheet.current;
    closeSheet();
    state.tab = "quests"; state.catFilter = "all"; state.dayFilter = null; state.q = ""; $("#q").value = ""; state.highlight = id;
    render();
    const card = document.querySelector(`.card[data-id="${CSS.escape(id)}"]`);
    if (card) card.scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth", block: "center" });
    setTimeout(() => { if (state.highlight === id) state.highlight = null; }, 2700);
  },
  "subs-toggle": (el, id) => { state.openSubs.has(id) ? state.openSubs.delete(id) : state.openSubs.add(id); renderView(); },
  close: () => closeSheet(),
  "c-yes": () => {
    const s = state.sheet, q = byId(s.qid);
    sfx("tick");
    if (today() > q.due) s.step = "overdue"; else { s.mode = "normal"; s.step = "date"; }
    renderSheet();
  },
  "c-mode": el => { const s = state.sheet; s.mode = el.dataset.mode; s.doneDate = null; s.step = "date"; sfx("tick"); renderSheet(); },
  "c-next": () => {
    const s = state.sheet, q = byId(s.qid), v = $("#c-date").value, err = $("#c-err");
    const lim = dateLimits(q, s.mode);
    if (!isDate(v)) { err.textContent = t("errDate"); return; }
    if (v > today()) { err.textContent = t("errDateFuture"); return; }
    if (s.mode === "late" && v <= q.due) { err.textContent = t("errLateRange"); return; }
    if (s.mode === "forgot" && v > lim.max) { err.textContent = t("errForgotRange"); return; }
    s.doneDate = v; s.step = "big"; sfx("tick"); renderSheet();
  },
  "c-big": () => doComplete(),
  "g-yes": () => { state.sheet.step = "big"; sfx("tick"); renderSheet(); },
  "g-big": () => doFail(),
  "d-yes": () => { state.sheet.step = "form"; sfx("tick"); renderSheet(); },
  del: () => { state.sheet.step = "delete"; renderSheet(); },
  "del-yes": () => doDelete(),
  reopen: () => { state.sheet.step = "reopen"; renderSheet(); },
  "reopen-yes": () => doReopen(),
  backup: () => doBackup(),
  install: () => promptInstall(),
  signout: () => { closeSheet(); signOut(auth); },
  "auth-google": () => authGoogle(),
  "auth-signup": () => authEmail(true),
  "auth-forgot": () => authForgot(),
  "restore-yes": () => doRestore(),
  chip: el => { const inp = document.getElementById(el.dataset.target); if (inp) { inp.value = el.dataset.date; inp.dispatchEvent(new Event("input", { bubbles: true })); } },
  "est-chip": el => { const inp = $("#f-est"); if (inp) { inp.value = el.dataset.h; updateLoadWarn(); } },
  pip: el => {
    const wrap = el.closest(".pip-input"), v = +el.dataset.pv;
    wrap.dataset.v = v;
    wrap.querySelectorAll(".pip-btn").forEach(b => { const i = +b.dataset.pv; b.classList.toggle("on", i <= v); b.setAttribute("aria-checked", i === v); });
    const labels = wrap.classList.contains("diff") ? L().diffLabels : L().impLabels;
    wrap.querySelector(".pip-text").textContent = labels[v - 1];
  },
  "cat-pick": el => {
    const wrap = $("#cat-pick"); wrap.dataset.v = el.dataset.c;
    wrap.querySelectorAll("[data-act=cat-pick]").forEach(b => b.setAttribute("aria-pressed", b.dataset.c === el.dataset.c));
  },
  "cat-new": () => { const box = $("#cat-new"); box.hidden = false; $("#cat-name").focus(); },
  "cat-add": () => {
    const name = $("#cat-name").value.trim(); if (!name) return;
    const cats = state.settings.categories;
    const c = { id: "c" + uid(), name, color: nextColor(cats) };
    state.settings = { ...state.settings, categories: cats.concat([c]) };
    saveSettings({ categories: state.settings.categories });
    const wrap = $("#cat-pick"); wrap.dataset.v = c.id; wrap.innerHTML = catPicker(c.id);
    $("#cat-name").value = ""; $("#cat-new").hidden = true;
  },
  "st-add": () => addSubtaskRow(),
  "st-remove": el => el.closest(".st-row").remove(),
  "s-cat-remove": el => { readSettingsDraft(); const id = el.closest(".set-cat").dataset.cid; state.sheet.draft = state.sheet.draft.filter(c => c.id !== id); renderSheet(); },
  "s-cat-add": () => {
    const name = $("#s-cat-new").value.trim(); if (!name) return;
    readSettingsDraft();
    state.sheet.draft.push({ id: "c" + uid(), name, color: nextColor(state.sheet.draft) });
    renderSheet(); $("#s-cat-new")?.focus();
  },
  "ov-close": () => closeOverlay(),
  inbox: () => openInbox(),
  "nt-open": el => openNote(el.dataset.nid)
};

document.addEventListener("click", e => {
  const ov = $("#ov");
  if (!ov.hidden && e.target.closest("#ov") && !e.target.closest("[data-act]")) { if (Date.now() > ovReadyAt) closeOverlay(); return; }
  if (e.target === $("#scrim")) { closeSheet(); return; }
  const el = e.target.closest("[data-act]");
  if (!el) return;
  const id = el.dataset.id || el.closest("[data-id]")?.dataset.id;
  const h = handlers[el.dataset.act];
  if (h) h(el, id, e);
});
document.addEventListener("change", e => {
  const el = e.target;
  if (el.matches("input[type=checkbox][data-sub]")) toggleSub(el.dataset.id, el.dataset.sub, el.checked);
  if (el.id === "f-repeat") { const n = $("#repeat-note"); if (n) n.hidden = el.value === "none"; }
  if (el.id === "restore-file" && el.files && el.files[0]) { readSettingsDraft(); readBackupFile(el.files[0]); }
});
document.addEventListener("submit", e => {
  e.preventDefault();
  if (e.target.id === "qform") submitQuest();
  else if (e.target.id === "dform") submitDates();
  else if (e.target.id === "sform") submitSettings();
  else if (e.target.id === "auth-form") authEmail(false);
});
let searchTimer;
document.addEventListener("input", e => {
  const id = e.target.id;
  if (id === "q") {
    state.q = e.target.value;
    $("#q-clear").hidden = !state.q;
    clearTimeout(searchTimer);
    searchTimer = setTimeout(renderView, 120);
    return;
  }
  if (id === "f-due") { const p = $("#f-plan"); if (p) p.max = e.target.value; }
  if (id === "d-due") { const p = $("#d-plan"); if (p) p.max = e.target.value; }
  if (id === "f-plan" || id === "f-est") updateLoadWarn();
  if (id === "c-date" && state.sheet) { const q = byId(state.sheet.qid); $("#c-preview").innerHTML = previewTiming(q, state.sheet.mode, e.target.value); $("#c-err").textContent = ""; }
  if (/^(f|d)-/.test(id)) { const er = $("#f-err") || $("#d-err"); if (er) er.textContent = ""; }
});
document.addEventListener("keydown", e => {
  if (e.key === "Enter" && e.target.matches("#st-new, .st-text, #cat-name, #s-cat-new, #sform .set-cat input")) {
    e.preventDefault();
    if (e.target.id === "st-new") addSubtaskRow();
    else if (e.target.id === "cat-name") handlers["cat-add"]();
    else if (e.target.id === "s-cat-new") handlers["s-cat-add"]();
    return;
  }
  if (e.key !== "Escape") return;
  if (!$("#ov").hidden) closeOverlay();
  else if (state.sheet) closeSheet();
  else if (e.target.id === "q" && state.q) handlers["q-clear"]();
});

/* refresh "today"-dependent badges when the date rolls over or the page comes back */
let lastDay = today();
const dayCheck = () => { if (today() !== lastDay) { lastDay = today(); render(); maintain(); } genNotifications(); };
setInterval(dayCheck, 60000);
document.addEventListener("visibilitychange", () => { if (!document.hidden) dayCheck(); });

/* ---------- data ---------- */
const REPEATS = ["none", "daily", "weekly", "biweekly", "monthly"];
function normalize(id, d) {
  const n = (v, def) => { v = Number(v); return v >= 1 && v <= 5 ? Math.round(v) : def; };
  return {
    id,
    title: String(d.title || "").slice(0, 300) || "—",
    desc: String(d.desc || ""),
    cat: typeof d.cat === "string" && d.cat ? d.cat : null,
    est: Number(d.est) > 0 ? Math.round(Number(d.est)) : 0,
    subtasks: Array.isArray(d.subtasks) ? d.subtasks.filter(s => s && typeof s.text === "string" && s.text.trim()).map((s, i) => ({ id: String(s.id || "s" + i), text: s.text, done: !!s.done })) : [],
    repeat: REPEATS.includes(d.repeat) ? d.repeat : "none",
    seriesId: typeof d.seriesId === "string" ? d.seriesId : null,
    nextId: typeof d.nextId === "string" ? d.nextId : null,
    spawned: !!d.spawned,
    due: isDate(d.due) ? d.due : today(),
    plan: isDate(d.plan) ? d.plan : null,
    difficulty: n(d.difficulty, 3), importance: n(d.importance, 3),
    status: ["active", "done", "failed"].includes(d.status) ? d.status : "active",
    createdDate: isDate(d.createdDate) ? d.createdDate : null,
    createdAt: Number(d.createdAt) || 0,
    doneDate: isDate(d.doneDate) ? d.doneDate : null,
    timing: ["early", "ontime", "late"].includes(d.timing) ? d.timing : "ontime",
    forgot: !!d.forgot,
    failedDate: isDate(d.failedDate) ? d.failedDate : null,
    xp: Number.isFinite(d.xp) ? d.xp : null,
    xpLoss: Number.isFinite(d.xpLoss) ? d.xpLoss : null,
    goalBonus: Number.isFinite(d.goalBonus) ? d.goalBonus : null,
    resolvedAt: Number(d.resolvedAt) || 0,
    extensions: Array.isArray(d.extensions) ? d.extensions.filter(e => e && isDate(e.fromDue) && isDate(e.toDue)) : []
  };
}
function normalizeSettings(d) {
  const cats = Array.isArray(d?.categories) ? d.categories.filter(c => c && typeof c.id === "string" && typeof c.name === "string" && c.name.trim())
    .map(c => ({ id: c.id, name: c.name.slice(0, 40), color: Number.isInteger(c.color) ? c.color : 0 })) : [];
  const cap = Number(d?.capacity), goal = Number(d?.dailyGoal);
  const badges = {};
  if (d && d.badges && typeof d.badges === "object") for (const [k, v] of Object.entries(d.badges)) if (isDate(v)) badges[k] = v;
  return {
    categories: cats,
    capacity: Number.isFinite(cap) && cap >= 0 ? cap : 240,
    dailyGoal: Number.isInteger(goal) && goal >= 0 ? Math.min(20, goal) : 2,
    badges,
    lastSummary: isDate(d?.lastSummary) ? d.lastSummary : null
  };
}

/* ---------- Firebase ---------- */
const configOk = !!(firebaseConfig && firebaseConfig.apiKey && firebaseConfig.projectId);
const fbApp = configOk ? initializeApp(firebaseConfig) : null;
const auth = fbApp ? getAuth(fbApp) : null;
const fdb = fbApp ? initializeFirestore(fbApp, { localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }) }) : null;

/* small adapter so the app code talks to Firestore through the same doc/collection shape it always used */
function wrapRef(ref) {
  return {
    id: ref.id,
    set: d => setDoc(ref, d),
    merge: d => setDoc(ref, d, { merge: true }),
    update: d => updateDoc(ref, d),
    delete: () => deleteDoc(ref),
    get: async () => { const s = await getDoc(ref); return { exists: s.exists(), data: () => s.data() }; },
    onSnapshot: (next, err) => onSnapshot(ref, { includeMetadataChanges: true },
      s => next({ exists: s.exists(), data: () => s.data(), metadata: { fromCache: s.metadata.fromCache } }), err)
  };
}
function makeCol(uid) {
  const c = collection(fdb, "users", uid, "quests");
  return {
    doc: id => wrapRef(id ? doc(c, id) : doc(c)),
    onSnapshot: (next, err) => onSnapshot(c, { includeMetadataChanges: true },
      snap => next({ docs: snap.docs.map(d => ({ id: d.id, exists: true, data: () => d.data() })), metadata: { fromCache: snap.metadata.fromCache } }), err)
  };
}

/* sign-in screen */
let authBusy = false, authMsg = "", authMsgOk = false;
function renderAuth() {
  document.documentElement.lang = state.lang;
  $("#app-root").hidden = true;
  const a = $("#auth");
  a.hidden = false;
  const emailVal = $("#auth-email")?.value || "";
  a.innerHTML = `<div class="auth-card">
      <div class="auth-top">
        <svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 3 41 9v13c0 11-7.4 19.4-17 23C14.4 41.4 7 33 7 22V9z" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/><path d="m16 24 6 6 11-12" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <div class="seg" role="group" aria-label="Language">
          <button type="button" data-act="lang" data-lang="tr" aria-pressed="${state.lang === "tr"}">TR</button>
          <button type="button" data-act="lang" data-lang="en" aria-pressed="${state.lang === "en"}">EN</button>
        </div>
      </div>
      <h1>Quest Log</h1>
      <p class="auth-lead">${esc(configOk ? t("authLead") : t("configMissing"))}</p>
      ${configOk ? `
      <button type="button" class="btn wide auth-google" data-act="auth-google" ${authBusy ? "disabled" : ""}>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M22.6 12.3c0-.8-.1-1.5-.2-2.3H12v4.3h6a5.1 5.1 0 0 1-2.2 3.4v2.8h3.6c2.1-1.9 3.2-4.8 3.2-8.2z"/><path fill="#34A853" d="M12 23c3 0 5.5-1 7.4-2.7l-3.6-2.8c-1 .7-2.3 1.1-3.8 1.1-2.9 0-5.4-2-6.3-4.6H2v2.9A11 11 0 0 0 12 23z"/><path fill="#FBBC05" d="M5.7 14c-.2-.7-.4-1.3-.4-2s.1-1.4.4-2V7.1H2a11 11 0 0 0 0 9.8z"/><path fill="#EA4335" d="M12 5.4c1.6 0 3.1.6 4.2 1.7l3.2-3.2A11 11 0 0 0 2 7.1L5.7 10c.9-2.7 3.4-4.6 6.3-4.6z"/></svg>
        ${esc(t("authGoogle"))}</button>
      <p class="auth-or"><span>${esc(t("authOr"))}</span></p>
      <form id="auth-form" novalidate>
        <label class="field"><span>${esc(t("authEmail"))}</span><input type="email" id="auth-email" autocomplete="email" inputmode="email" value="${esc(emailVal)}"></label>
        <label class="field"><span>${esc(t("authPass"))}</span><input type="password" id="auth-pass" autocomplete="current-password" minlength="6"></label>
        <p class="${authMsgOk ? "help" : "err"}" id="auth-msg" role="alert">${esc(authMsg)}</p>
        <div class="auth-actions">
          <button type="submit" class="btn primary" ${authBusy ? "disabled" : ""}>${esc(t("authSignIn"))}</button>
          <button type="button" class="btn" data-act="auth-signup" ${authBusy ? "disabled" : ""}>${esc(t("authSignUp"))}</button>
        </div>
        <p style="margin:14px 0 0"><button type="button" class="link neutral" data-act="auth-forgot">${esc(t("authForgot"))}</button></p>
      </form>` : ""}
    </div>`;
}
function authFail(e) {
  if (e && (e.code === "auth/popup-closed-by-user" || e.code === "auth/cancelled-popup-request")) { authBusy = false; renderAuth(); return; }
  console.error(e);
  authBusy = false; authMsgOk = false;
  authMsg = (e && L().authErr[e.code]) || t("authErrGeneric");
  renderAuth();
}
async function authGoogle() {
  authBusy = true; authMsg = ""; renderAuth();
  try { await signInWithPopup(auth, new GoogleAuthProvider()); authBusy = false; }
  catch (e) { authFail(e); }
}
async function authEmail(create) {
  const email = $("#auth-email").value.trim(), pass = $("#auth-pass").value;
  if (!email || !pass) { authMsgOk = false; authMsg = !email ? t("authNeedEmail") : t("authErr")["auth/weak-password"]; renderAuth(); return; }
  authBusy = true; authMsg = ""; renderAuth();
  try {
    if (create) await createUserWithEmailAndPassword(auth, email, pass);
    else await signInWithEmailAndPassword(auth, email, pass);
    authBusy = false;
  } catch (e) { authFail(e); }
}
async function authForgot() {
  const email = $("#auth-email")?.value.trim();
  if (!email) { authMsgOk = false; authMsg = t("authNeedEmail"); renderAuth(); return; }
  try { await sendPasswordResetEmail(auth, email); authMsgOk = true; authMsg = t("authResetSent"); renderAuth(); }
  catch (e) { authFail(e); }
}

/* install prompt (Android Chrome / desktop Chrome & Edge) */
function promptInstall() {
  if (!installEvt) return;
  installEvt.prompt();
  installEvt.userChoice.finally(() => { installEvt = null; renderChrome(); if (state.sheet?.kind === "settings") renderSheet(); });
}
window.addEventListener("beforeinstallprompt", e => { e.preventDefault(); installEvt = e; if (currentUser) renderChrome(); });
window.addEventListener("appinstalled", () => { installEvt = null; if (currentUser) renderChrome(); });

let unsub = null, unsubSettings = null, unsubInbox = null, retried = false;
function stopListening() {
  if (unsub) unsub(); if (unsubSettings) unsubSettings(); if (unsubInbox) unsubInbox();
  unsub = unsubSettings = unsubInbox = null;
}
function subscribe() {
  if (unsub) unsub();
  unsub = col.onSnapshot(snap => {
    state.quests = snap.docs.filter(d => d.exists).map(d => normalize(d.id, d.data()));
    state.loaded = true; state.sync = "on";
    render();
    if (state.sheet && state.sheet.qid && !byId(state.sheet.qid)) closeSheet();
    if (!snap.metadata?.fromCache) { questsReady = true; setTimeout(bootCheck, 0); }
    scheduleNotify();
  }, err => {
    if (err && err.code === "unavailable" && !retried) { retried = true; setTimeout(subscribe, 1500); return; }
    state.sync = "off"; render();
  });
  if (unsubSettings) unsubSettings();
  unsubSettings = settingsRef.onSnapshot(snap => {
    state.settings = normalizeSettings(snap.exists ? snap.data() : null);
    render();
    if (!snap.metadata?.fromCache) { settingsReady = true; setTimeout(bootCheck, 0); }
  }, () => { settingsReady = true; });
  if (unsubInbox) unsubInbox();
  unsubInbox = inboxRef.onSnapshot(snap => {
    state.inbox = normalizeInbox(snap.exists ? snap.data() : null);
    renderChrome();
    if (!snap.metadata?.fromCache) { inboxReady = true; setTimeout(bootCheck, 0); }
  }, () => { inboxReady = true; });
}

function startSession(user) {
  currentUser = user;
  $("#auth").hidden = true; $("#auth").innerHTML = "";
  $("#app-root").hidden = false;
  state.quests = []; state.loaded = false; state.sync = "pending";
  questsReady = settingsReady = inboxReady = bootChecked = false; retried = false;
  state.inbox = {}; pendingNotes.clear();
  col = makeCol(user.uid);
  settingsRef = wrapRef(doc(fdb, "users", user.uid, "meta", "settings"));
  inboxRef = wrapRef(doc(fdb, "users", user.uid, "meta", "inbox"));
  render();
  subscribe();
}
function endSession() {
  stopListening();
  currentUser = null; col = null; settingsRef = null; inboxRef = null;
  state.quests = []; state.loaded = false; state.sheet = null; state.inbox = {};
  state.settings = normalizeSettings(null);
  setAppBadge(0);
  ovQueue.length = 0; closeOverlay(); renderSheet();
  renderAuth();
}

if (!configOk) renderAuth();
else onAuthStateChanged(auth, user => { if (user) startSession(user); else endSession(); });
