<div align="center">
  <h1>🛠️ Ekinchi.Az — Real Layihə Arxitekturası və Dokumentasiyası</h1>
  <p><b>Bu sənəd sırf layihə kodlarında (src/) real olaraq yazılmış funksiyalar, fayllar və hook-lar əsasında tərtib edilib. Təqdimat zamanı dəqiq kod sətirlərini və faylları bu sənədə əsasən izah edə bilərsiniz.</b></p>
</div>

<hr/>

## 1. 🎛️ Qlobal State və `useReducer` Məntiqi

Layihədə Redux və ya `useContext` **istifadə olunmayıb**. Qlobal state idarəetməsi sırf React-in daxili `useReducer` hook-u ilə mərkəzləşdirilib.

- **Harada yerləşir?** 
  - Əsas State (Vəziyyət) məntiqi: **`src/store/appReducer.js`** faylındadır. Burada `appReducer` funksiyası var.
  - Actionlar (Əmrlər): **`src/store/appActions.js`** faylındadır (Məsələn: `SET_USER`, `SET_PAGE`).
  - **Tətbiqi (İstifadə yeri):** Bütün bunlar **`src/App.jsx`** faylında (sətir ~50-lərdə) `const [state, dispatch] = useReducer(appReducer, initialState);` şəklində birləşdirilir.
- **Məntiqi:** Bütün datalar (məsələn, `currentUser`, `activePage`) `App.jsx` faylından digər səhifə və komponentlərə (CreatePostPage, ProfilePage və s.) **Props** vasitəsilə (yuxarıdan aşağıya) ötürülür.

---

## 2. 🔄 CRUD (GET, POST, PUT, DELETE) Əməliyyatları Dəqiqliklə Haradadır?

Firebase (Firestore) ilə əlaqəli heç bir sorğu komponentlərin içinə səpələnməyib. Bütün CRUD əməliyyatları **`src/services/apiService.js`** faylındadır. Komponentlər yalnız bu fayldakı funksiyaları çağırır.

| Əməliyyat Tipi | apiService.js-dəki Funksiya | Arxadakı Firebase Metodu | Hansı Komponentdən Çağırılır? (Nümunə) |
| :--- | :--- | :--- | :--- |
| **CREATE** (Yaratmaq) | `createPostApi()` (Post üçün)<br>`addProductApi()` (Elan üçün) | `addDoc(collection(...))` | **`CreatePostPage.jsx`**-dən istifadəçi formda "Paylaş" basanda çağırılır. |
| **READ** (Oxumaq/Çəkmək) | `getPostsApi()`<br>`getProductsApi()`<br>`getUserProfileApi()` | `getDocs(query(...))`<br>`getDoc(doc(...))` | **`App.jsx`**, **`ProfilePage.jsx`**, və **`SocialFeedPage.jsx`**-dən `useEffect` içində çağırılır. Datalar xəta verməsin deyə `normalizePost()` funksiyası ilə təmizlənir. |
| **UPDATE** (Yeniləmək) | `updatePostApi()` | `updateDoc(doc(...))` | **`PostCard.jsx`** və ya **`PostModal.jsx`**-dən kimsə postu bəyənəndə və ya "Share" (Paylaş) edəndə çağırılır (Sırf `shareCount` yenilənir, post mətni silinmir). |
| **DELETE** (Silmək) | `deletePostApi()`<br>`deleteProductApi()` | `deleteDoc(doc(...))` | **`PostCard.jsx`**-də postun sahibi öz postunu silmək istəyəndə çağırılır. |

---

## 3. 🎣 React Hook-larının Tətbiqi (Tam və Dəqiq Siyahı)

Layihədə aktiv olaraq istifadə edilən bütün Hook-lar və onların **dəqiq** istifadə yerləri:

### 1. `useState` (Lokal vəziyyət)
- **Nə işə yarayır:** İnputlardakı dəyərləri, modal pəncərələrin açılıb-bağlanmasını, `loading` vəziyyətlərini anlıq tutmaq üçün.
- **Real İstifadə Yeri:** Demək olar hər yerdə. Məsələn, **`CreatePostPage.jsx`**-də yazılan mətni (`description`) və əlavə edilən şəkilləri (`images`) yadda saxlamaq üçün; **`AuthModal.jsx`**-də istifadəçinin daxil etdiyi e-poçt və şifrəni tutmaq üçün.

### 2. `useEffect` (Side-effects / API çağırışları)
- **Nə işə yarayır:** Səhifə (komponent) ilk dəfə render olanda və ya asılı olduğu state dəyişəndə bir funksiyanı işə salmaq üçün.
- **Real İstifadə Yeri:** **`App.jsx`**-də səhifə açılanda istifadəçinin əvvəlcədən daxil olub-olmadığını (Auth state) yoxlamaq üçün; **`ProfilePage.jsx`** açılanda o profilə aid postları (`getPostsApi` ilə) bazadan gətirmək üçün.

### 3. `useRef` (DOM Manipulyasiyası)
- **Nə işə yarayır:** React-in Virtual DOM-undan kənara çıxaraq birbaşa real HTML elementinə toxunmaq üçün.
- **Real İstifadə Yeri:** 
  1. **`CreatePostPage.jsx`**: Ekranda görünən şəkilli butona klikləyəndə, arxa planda gizlədilmiş `<input type="file" ref={fileInputRef} />` elementinə proqrammatik olaraq kliklətmək üçün.
  2. **`PostModal.jsx`**: Kimsə rəy (comment) yazanda səhifəni avtomatik olaraq ən aşağı (rəylərin sonuna) scroll etmək üçün.

### 4. `useCallback` (Funksiya Cache-ləmə)
- **Nə işə yarayır:** Səhifədə hər hansı başqa şey (məsələn, bir input) dəyişəndə ağır funksiyaların yenidən render (create) olmasının qarşısını alır.
- **Real İstifadə Yeri:** **`CreatePostPage.jsx`**-də `processFiles` funksiyasında. Şəkillərin ölçüsünün kiçildilməsi ağır əməliyyat olduğu üçün o yalnız şəkil seçiləndə yaranır, mətn yazdıqca yenidən render olmur.

### 5. `useMemo` (Dəyər/Hesablama Cache-ləmə)
- **Nə işə yarayır:** Ağır hesablamaların yalnız asılılıqlar dəyişdikdə yenidən hesablanmasını təmin edir. Yaddaşı (RAM) və CPU-nu qoruyur.
- **Real İstifadə Yeri:** Layihədə məhz bu fayllarda işlədilib:
  1. **`src/components/RentalBookingModal.jsx`**: Texnika icarəyə götürülərkən `estimatedCost` (yekun qiymət) hesablanması üçün. İstifadəçi saatı və ya günü dəyişəndə yalnız o zaman hesablama aparılır.
  2. **`src/pages/ListingsPage.jsx`**: Axtarış verildikdə və ya filtr dəyişdikdə bazadakı elanları süzgəcdən keçirib `filteredProducts` yaratmaq üçün. Bütün elanları dayanmadan süzmək əvəzinə yaddaşda saxlayır.

### *Qeyd: `useContext` layihədə işlədilməyib! Bütün struktur mərkəzi `App.jsx` state-i və `Props` drilling məntiqi ilə ən sağlam və təmiz formada qurulub.*

---

## 4. 📁 Qovluqlara Görə Detallı İzah (Fayl Fayl)

### 🧩 Components (Kiçik və təkrar istifadə olunan hissələr)
- **`AuthModal.jsx`**: İstifadəçi giriş-qeydiyyat pəncərəsi.
- **`PostCard.jsx`**: Tək bir post blokudur. Üzərində like, share butonları və şəkil karuseli (slider) var. `onEdit`, `onDelete` kimi prop-lar qəbul edir.
- **`PostModal.jsx`**: `PostCard`-ın üzərinə basıldıqda tam ekran (və ya popup) olaraq açılan, içində rəylərin göründüyü komponent.
- **`RentalBookingModal.jsx`**: Texnikanı icarəyə götürmək üçün açılan xüsusi form. Burada riyazi məntiq və `useMemo` var.
- **`ErrorBoundary.jsx`**: Tətbiqdə hər hansı komponent çöksə (məs: xətalı data gəlsə), ekranda "Qırmızı Xəta" yazısı çıxmasın deyə onu bürüyən təhlükəsizlik səddi.

### 📄 Pages (Böyük Səhifələr)
- **`HomePage.jsx`**: Açılış səhifəsi. Üst tərəfdə kateqoriyalar, aşağıda həm lent, həm də VIP elanlar.
- **`SocialFeedPage.jsx`**: İnstagram/Facebook tərzində yalnız fermerlərin paylaşımlarının oxunduğu, sürüşdürüldüyü lent səhifəsi.
- **`CreatePostPage.jsx`**: Fermerlərin post yaratmaq üçün istifadə etdiyi, lucide-react ikonlarından istifadə olunan, `imageService.js` üzərindən şəkli `ImgBB` platformasına yükləyən kompleks səhifə.
- **`AddListingPage.jsx`**: Kənd təsərrüfatı texnikası, toxum, gübrə kimi məhsulların satış və ya icarə elanını yerləşdirmək üçün nəzərdə tutulmuş form səhifəsi.
- **`ProfilePage.jsx`**: Fermerin şəxsi kabineti. Onun paylaşdığı postlar, bəyəndiyi elanlar, izlədiyi adamların (Following/Followers) rəqəmləri burada göstərilir.

### ⚙️ Services (Xarici Əlaqə və Logika)
- **`apiService.js`**: (Yuxarıda CRUD bölümündə izah edilib). Bütün Firebase işləri.
- **`imageService.js`**: Baza limitini qorumaq üçün böyük şəkilləri əvvəlcə brauzerdə kiçildir (compress), sonra URL formasına salaraq API-ə göndərir. (Çox vacib performans detalıdır).

<br/>

