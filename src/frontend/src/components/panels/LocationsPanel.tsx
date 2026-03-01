import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Globe,
  MapPin,
  Navigation,
  RotateCcw,
  Save,
} from "lucide-react";
import { useState } from "react";

// ─── Props ────────────────────────────────────────────────────────────────────

interface LocationsPanelProps {
  onStateFilter: (state: string) => void;
  activeState?: string;
}

// ─── District Data ─────────────────────────────────────────────────────────────

const INDIA_DISTRICTS: Record<string, string[]> = {
  "Andhra Pradesh": [
    "Anantapur",
    "Chittoor",
    "East Godavari",
    "Guntur",
    "Krishna",
    "Kurnool",
    "Prakasam",
    "Srikakulam",
    "Visakhapatnam",
    "Vizianagaram",
    "West Godavari",
    "YSR Kadapa",
  ],
  "Arunachal Pradesh": [
    "Anjaw",
    "Changlang",
    "Dibang Valley",
    "East Kameng",
    "East Siang",
    "Kamle",
    "Kra Daadi",
    "Kurung Kumey",
    "Lepa Rada",
    "Lohit",
    "Longding",
    "Lower Dibang Valley",
    "Lower Siang",
    "Lower Subansiri",
    "Namsai",
    "Pakke Kessang",
    "Papum Pare",
    "Shi Yomi",
    "Siang",
    "Tawang",
    "Tirap",
    "Upper Dibang Valley",
    "Upper Siang",
    "Upper Subansiri",
    "West Kameng",
    "West Siang",
  ],
  Assam: [
    "Baksa",
    "Barpeta",
    "Biswanath",
    "Bongaigaon",
    "Cachar",
    "Charaideo",
    "Chirang",
    "Darrang",
    "Dhemaji",
    "Dhubri",
    "Dibrugarh",
    "Dima Hasao",
    "Goalpara",
    "Golaghat",
    "Hailakandi",
    "Hojai",
    "Jorhat",
    "Kamrup",
    "Kamrup Metropolitan",
    "Karbi Anglong",
    "Karimganj",
    "Kokrajhar",
    "Lakhimpur",
    "Majuli",
    "Morigaon",
    "Nagaon",
    "Nalbari",
    "Sivasagar",
    "Sonitpur",
    "South Salmara-Mankachar",
    "Tinsukia",
    "Udalguri",
    "West Karbi Anglong",
  ],
  Bihar: [
    "Araria",
    "Arwal",
    "Aurangabad",
    "Banka",
    "Begusarai",
    "Bhagalpur",
    "Bhojpur",
    "Buxar",
    "Darbhanga",
    "East Champaran",
    "Gaya",
    "Gopalganj",
    "Jamui",
    "Jehanabad",
    "Kaimur",
    "Katihar",
    "Khagaria",
    "Kishanganj",
    "Lakhisarai",
    "Madhepura",
    "Madhubani",
    "Munger",
    "Muzaffarpur",
    "Nalanda",
    "Nawada",
    "Patna",
    "Purnia",
    "Rohtas",
    "Saharsa",
    "Samastipur",
    "Saran",
    "Sheikhpura",
    "Sheohar",
    "Sitamarhi",
    "Siwan",
    "Supaul",
    "Vaishali",
    "West Champaran",
  ],
  Chhattisgarh: [
    "Balod",
    "Baloda Bazar",
    "Balrampur",
    "Bastar",
    "Bemetara",
    "Bijapur",
    "Bilaspur",
    "Dantewada",
    "Dhamtari",
    "Durg",
    "Gariaband",
    "Gaurela-Pendra-Marwahi",
    "Janjgir-Champa",
    "Jashpur",
    "Kabirdham",
    "Kanker",
    "Kondagaon",
    "Korba",
    "Koriya",
    "Mahasamund",
    "Mungeli",
    "Narayanpur",
    "Raigarh",
    "Raipur",
    "Rajnandgaon",
    "Sukma",
    "Surajpur",
    "Surguja",
  ],
  Goa: ["North Goa", "South Goa"],
  Gujarat: [
    "Ahmedabad",
    "Amreli",
    "Anand",
    "Aravalli",
    "Banaskantha",
    "Bharuch",
    "Bhavnagar",
    "Botad",
    "Chhota Udaipur",
    "Dahod",
    "Dang",
    "Devbhoomi Dwarka",
    "Gandhinagar",
    "Gir Somnath",
    "Jamnagar",
    "Junagadh",
    "Kheda",
    "Kutch",
    "Mahisagar",
    "Mehsana",
    "Morbi",
    "Narmada",
    "Navsari",
    "Panchmahal",
    "Patan",
    "Porbandar",
    "Rajkot",
    "Sabarkantha",
    "Surat",
    "Surendranagar",
    "Tapi",
    "Vadodara",
    "Valsad",
  ],
  Haryana: [
    "Ambala",
    "Bhiwani",
    "Charkhi Dadri",
    "Faridabad",
    "Fatehabad",
    "Gurugram",
    "Hisar",
    "Jhajjar",
    "Jind",
    "Kaithal",
    "Karnal",
    "Kurukshetra",
    "Mahendragarh",
    "Nuh",
    "Palwal",
    "Panchkula",
    "Panipat",
    "Rewari",
    "Rohtak",
    "Sirsa",
    "Sonipat",
    "Yamunanagar",
  ],
  "Himachal Pradesh": [
    "Bilaspur",
    "Chamba",
    "Hamirpur",
    "Kangra",
    "Kinnaur",
    "Kullu",
    "Lahaul and Spiti",
    "Mandi",
    "Shimla",
    "Sirmaur",
    "Solan",
    "Una",
  ],
  Jharkhand: [
    "Bokaro",
    "Chatra",
    "Deoghar",
    "Dhanbad",
    "Dumka",
    "East Singhbhum",
    "Garhwa",
    "Giridih",
    "Godda",
    "Gumla",
    "Hazaribagh",
    "Jamtara",
    "Khunti",
    "Koderma",
    "Latehar",
    "Lohardaga",
    "Pakur",
    "Palamu",
    "Ramgarh",
    "Ranchi",
    "Sahebganj",
    "Seraikela Kharsawan",
    "Simdega",
    "West Singhbhum",
  ],
  Karnataka: [
    "Bagalkot",
    "Ballari",
    "Belagavi",
    "Bengaluru Rural",
    "Bengaluru Urban",
    "Bidar",
    "Chamarajanagar",
    "Chikkaballapur",
    "Chikkamagaluru",
    "Chitradurga",
    "Dakshina Kannada",
    "Davanagere",
    "Dharwad",
    "Gadag",
    "Hassan",
    "Haveri",
    "Kalaburagi",
    "Kodagu",
    "Kolar",
    "Koppal",
    "Mandya",
    "Mysuru",
    "Raichur",
    "Ramanagara",
    "Shivamogga",
    "Tumakuru",
    "Udupi",
    "Uttara Kannada",
    "Vijayapura",
    "Yadgir",
  ],
  Kerala: [
    "Alappuzha",
    "Ernakulam",
    "Idukki",
    "Kannur",
    "Kasaragod",
    "Kollam",
    "Kottayam",
    "Kozhikode",
    "Malappuram",
    "Palakkad",
    "Pathanamthitta",
    "Thiruvananthapuram",
    "Thrissur",
    "Wayanad",
  ],
  "Madhya Pradesh": [
    "Agar Malwa",
    "Alirajpur",
    "Anuppur",
    "Ashoknagar",
    "Balaghat",
    "Barwani",
    "Betul",
    "Bhind",
    "Bhopal",
    "Burhanpur",
    "Chhatarpur",
    "Chhindwara",
    "Damoh",
    "Datia",
    "Dewas",
    "Dhar",
    "Dindori",
    "Guna",
    "Gwalior",
    "Harda",
    "Hoshangabad",
    "Indore",
    "Jabalpur",
    "Jhabua",
    "Katni",
    "Khandwa",
    "Khargone",
    "Mandla",
    "Mandsaur",
    "Morena",
    "Narsinghpur",
    "Neemuch",
    "Niwari",
    "Panna",
    "Raisen",
    "Rajgarh",
    "Ratlam",
    "Rewa",
    "Sagar",
    "Satna",
    "Sehore",
    "Seoni",
    "Shahdol",
    "Shajapur",
    "Sheopur",
    "Shivpuri",
    "Sidhi",
    "Singrauli",
    "Tikamgarh",
    "Ujjain",
    "Umaria",
    "Vidisha",
  ],
  Maharashtra: [
    "Ahmednagar",
    "Akola",
    "Amravati",
    "Aurangabad",
    "Beed",
    "Bhandara",
    "Buldhana",
    "Chandrapur",
    "Dhule",
    "Gadchiroli",
    "Gondia",
    "Hingoli",
    "Jalgaon",
    "Jalna",
    "Kolhapur",
    "Latur",
    "Mumbai City",
    "Mumbai Suburban",
    "Nagpur",
    "Nanded",
    "Nandurbar",
    "Nashik",
    "Osmanabad",
    "Palghar",
    "Parbhani",
    "Pune",
    "Raigad",
    "Ratnagiri",
    "Sangli",
    "Satara",
    "Sindhudurg",
    "Solapur",
    "Thane",
    "Wardha",
    "Washim",
    "Yavatmal",
  ],
  Manipur: [
    "Bishnupur",
    "Chandel",
    "Churachandpur",
    "Imphal East",
    "Imphal West",
    "Jiribam",
    "Kakching",
    "Kamjong",
    "Kangpokpi",
    "Noney",
    "Pherzawl",
    "Senapati",
    "Tamenglong",
    "Tengnoupal",
    "Thoubal",
    "Ukhrul",
  ],
  Meghalaya: [
    "East Garo Hills",
    "East Jaintia Hills",
    "East Khasi Hills",
    "Eastern West Khasi Hills",
    "North Garo Hills",
    "Ri Bhoi",
    "South Garo Hills",
    "South West Garo Hills",
    "South West Khasi Hills",
    "West Garo Hills",
    "West Jaintia Hills",
    "West Khasi Hills",
  ],
  Mizoram: [
    "Aizawl",
    "Champhai",
    "Hnahthial",
    "Khawzawl",
    "Kolasib",
    "Lawngtlai",
    "Lunglei",
    "Mamit",
    "Saitual",
    "Serchhip",
  ],
  Nagaland: [
    "Chumoukedima",
    "Dimapur",
    "Kiphire",
    "Kohima",
    "Longleng",
    "Mokokchung",
    "Mon",
    "Niuland",
    "Noklak",
    "Peren",
    "Phek",
    "Shamator",
    "Tseminyu",
    "Tuensang",
    "Wokha",
    "Zunheboto",
  ],
  Odisha: [
    "Angul",
    "Balangir",
    "Balasore",
    "Bargarh",
    "Bhadrak",
    "Boudh",
    "Cuttack",
    "Deogarh",
    "Dhenkanal",
    "Gajapati",
    "Ganjam",
    "Jagatsinghpur",
    "Jajpur",
    "Jharsuguda",
    "Kalahandi",
    "Kandhamal",
    "Kendrapara",
    "Kendujhar",
    "Khordha",
    "Koraput",
    "Malkangiri",
    "Mayurbhanj",
    "Nabarangpur",
    "Nayagarh",
    "Nuapada",
    "Puri",
    "Rayagada",
    "Sambalpur",
    "Subarnapur",
    "Sundargarh",
  ],
  Punjab: [
    "Amritsar",
    "Barnala",
    "Bathinda",
    "Faridkot",
    "Fatehgarh Sahib",
    "Fazilka",
    "Ferozepur",
    "Gurdaspur",
    "Hoshiarpur",
    "Jalandhar",
    "Kapurthala",
    "Ludhiana",
    "Malerkotla",
    "Mansa",
    "Moga",
    "Mohali",
    "Muktsar",
    "Pathankot",
    "Patiala",
    "Rupnagar",
    "Sangrur",
    "Shaheed Bhagat Singh Nagar",
    "Tarn Taran",
  ],
  Rajasthan: [
    "Ajmer",
    "Alwar",
    "Banswara",
    "Baran",
    "Barmer",
    "Bharatpur",
    "Bhilwara",
    "Bikaner",
    "Bundi",
    "Chittorgarh",
    "Churu",
    "Dausa",
    "Dholpur",
    "Dungarpur",
    "Hanumangarh",
    "Jaipur",
    "Jaisalmer",
    "Jalore",
    "Jhalawar",
    "Jhunjhunu",
    "Jodhpur",
    "Karauli",
    "Kota",
    "Nagaur",
    "Pali",
    "Pratapgarh",
    "Rajsamand",
    "Sawai Madhopur",
    "Sikar",
    "Sirohi",
    "Sri Ganganagar",
    "Tonk",
    "Udaipur",
  ],
  Sikkim: [
    "East Sikkim",
    "North Sikkim",
    "Pakyong",
    "Soreng",
    "South Sikkim",
    "West Sikkim",
  ],
  "Tamil Nadu": [
    "Ariyalur",
    "Chengalpattu",
    "Chennai",
    "Coimbatore",
    "Cuddalore",
    "Dharmapuri",
    "Dindigul",
    "Erode",
    "Kallakurichi",
    "Kanchipuram",
    "Kanyakumari",
    "Karur",
    "Krishnagiri",
    "Madurai",
    "Mayiladuthurai",
    "Nagapattinam",
    "Namakkal",
    "Nilgiris",
    "Perambalur",
    "Pudukkottai",
    "Ramanathapuram",
    "Ranipet",
    "Salem",
    "Sivaganga",
    "Tenkasi",
    "Thanjavur",
    "Theni",
    "Thoothukudi",
    "Tiruchirappalli",
    "Tirunelveli",
    "Tirupathur",
    "Tiruppur",
    "Tiruvallur",
    "Tiruvannamalai",
    "Tiruvarur",
    "Vellore",
    "Viluppuram",
    "Virudhunagar",
  ],
  Telangana: [
    "Adilabad",
    "Bhadradri Kothagudem",
    "Hanamkonda",
    "Hyderabad",
    "Jagtial",
    "Jangaon",
    "Jayashankar Bhupalpally",
    "Jogulamba Gadwal",
    "Kamareddy",
    "Karimnagar",
    "Khammam",
    "Kumuram Bheem",
    "Mahabubabad",
    "Mahabubnagar",
    "Mancherial",
    "Medak",
    "Medchal-Malkajgiri",
    "Mulugu",
    "Nagarkurnool",
    "Nalgonda",
    "Narayanpet",
    "Nirmal",
    "Nizamabad",
    "Peddapalli",
    "Rajanna Sircilla",
    "Ranga Reddy",
    "Sangareddy",
    "Siddipet",
    "Suryapet",
    "Vikarabad",
    "Wanaparthy",
    "Warangal",
    "Yadadri Bhuvanagiri",
  ],
  Tripura: [
    "Dhalai",
    "Gomati",
    "Khowai",
    "North Tripura",
    "Sepahijala",
    "South Tripura",
    "Unakoti",
    "West Tripura",
  ],
  "Uttar Pradesh": [
    "Agra",
    "Aligarh",
    "Ambedkar Nagar",
    "Amethi",
    "Amroha",
    "Auraiya",
    "Ayodhya",
    "Azamgarh",
    "Baghpat",
    "Bahraich",
    "Ballia",
    "Balrampur",
    "Banda",
    "Barabanki",
    "Bareilly",
    "Basti",
    "Bhadohi",
    "Bijnor",
    "Budaun",
    "Bulandshahr",
    "Chandauli",
    "Chitrakoot",
    "Deoria",
    "Etah",
    "Etawah",
    "Farrukhabad",
    "Fatehpur",
    "Firozabad",
    "Gautam Buddha Nagar",
    "Ghaziabad",
    "Ghazipur",
    "Gonda",
    "Gorakhpur",
    "Hamirpur",
    "Hapur",
    "Hardoi",
    "Hathras",
    "Jalaun",
    "Jaunpur",
    "Jhansi",
    "Kannauj",
    "Kanpur Dehat",
    "Kanpur Nagar",
    "Kasganj",
    "Kaushambi",
    "Kushinagar",
    "Lakhimpur Kheri",
    "Lalitpur",
    "Lucknow",
    "Maharajganj",
    "Mahoba",
    "Mainpuri",
    "Mathura",
    "Mau",
    "Meerut",
    "Mirzapur",
    "Moradabad",
    "Muzaffarnagar",
    "Pilibhit",
    "Pratapgarh",
    "Prayagraj",
    "Rae Bareli",
    "Rampur",
    "Saharanpur",
    "Sambhal",
    "Sant Kabir Nagar",
    "Shahjahanpur",
    "Shamli",
    "Shravasti",
    "Siddharthnagar",
    "Sitapur",
    "Sonbhadra",
    "Sultanpur",
    "Unnao",
    "Varanasi",
  ],
  Uttarakhand: [
    "Almora",
    "Bageshwar",
    "Chamoli",
    "Champawat",
    "Dehradun",
    "Haridwar",
    "Nainital",
    "Pauri Garhwal",
    "Pithoragarh",
    "Rudraprayag",
    "Tehri Garhwal",
    "Udham Singh Nagar",
    "Uttarkashi",
  ],
  "West Bengal": [
    "Alipurduar",
    "Bankura",
    "Birbhum",
    "Cooch Behar",
    "Dakshin Dinajpur",
    "Darjeeling",
    "Hooghly",
    "Howrah",
    "Jalpaiguri",
    "Jhargram",
    "Kalimpong",
    "Kolkata",
    "Malda",
    "Murshidabad",
    "Nadia",
    "North 24 Parganas",
    "Paschim Bardhaman",
    "Paschim Medinipur",
    "Purba Bardhaman",
    "Purba Medinipur",
    "Purulia",
    "South 24 Parganas",
    "Uttar Dinajpur",
  ],
  // Union Territories
  "Andaman and Nicobar Islands": [
    "Nicobar",
    "North and Middle Andaman",
    "South Andaman",
  ],
  Chandigarh: ["Chandigarh"],
  "Dadra and Nagar Haveli and Daman and Diu": [
    "Dadra and Nagar Haveli",
    "Daman",
    "Diu",
  ],
  Delhi: [
    "Central Delhi",
    "East Delhi",
    "New Delhi",
    "North Delhi",
    "North East Delhi",
    "North West Delhi",
    "Shahdara",
    "South Delhi",
    "South East Delhi",
    "South West Delhi",
    "West Delhi",
  ],
  "Jammu & Kashmir": [
    "Anantnag",
    "Bandipora",
    "Baramulla",
    "Budgam",
    "Doda",
    "Ganderbal",
    "Jammu",
    "Kathua",
    "Kishtwar",
    "Kulgam",
    "Kupwara",
    "Poonch",
    "Pulwama",
    "Rajouri",
    "Ramban",
    "Reasi",
    "Samba",
    "Shopian",
    "Srinagar",
    "Udhampur",
  ],
  Ladakh: ["Kargil", "Leh"],
  Lakshadweep: ["Lakshadweep"],
  Puducherry: ["Karaikal", "Mahe", "Puducherry", "Yanam"],
};

const ALL_STATES = Object.keys(INDIA_DISTRICTS).sort((a, b) =>
  a.localeCompare(b),
);

// ─── Step Config ──────────────────────────────────────────────────────────────

const STEPS = [
  { number: 1, label: "Country", icon: Globe },
  { number: 2, label: "State", icon: MapPin },
  { number: 3, label: "District", icon: MapPin },
  { number: 4, label: "Pincode", icon: Navigation },
  { number: 5, label: "Village", icon: Navigation },
] as const;

// ─── Step Indicator ───────────────────────────────────────────────────────────

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center justify-center px-4 py-5 gap-0">
      {STEPS.map((step, idx) => {
        const isCompleted = currentStep > step.number;
        const isActive = currentStep === step.number;
        return (
          <div key={step.number} className="flex items-center">
            {/* Circle */}
            <div className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 border-2",
                  isCompleted
                    ? "bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-200"
                    : isActive
                      ? "bg-primary border-primary text-primary-foreground shadow-md shadow-primary/30 scale-110"
                      : "bg-card border-border text-muted-foreground",
                )}
              >
                {isCompleted ? (
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                ) : (
                  step.number
                )}
              </div>
              <span
                className={cn(
                  "text-[9px] font-semibold uppercase tracking-wide whitespace-nowrap",
                  isActive
                    ? "text-primary"
                    : isCompleted
                      ? "text-emerald-600"
                      : "text-muted-foreground",
                )}
              >
                {step.label}
              </span>
            </div>
            {/* Connector line */}
            {idx < STEPS.length - 1 && (
              <div
                className={cn(
                  "w-6 h-0.5 mx-0.5 mb-5 transition-all duration-500",
                  currentStep > step.number ? "bg-emerald-500" : "bg-border",
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Navigation Buttons ───────────────────────────────────────────────────────

interface NavButtonsProps {
  step: number;
  onBack: () => void;
  onNext: () => void;
  nextDisabled?: boolean;
  nextLabel?: string;
  isSaving?: boolean;
}

function NavButtons({
  step,
  onBack,
  onNext,
  nextDisabled = false,
  nextLabel,
  isSaving = false,
}: NavButtonsProps) {
  const label = nextLabel ?? (step === 5 ? "Save Location" : "Continue");
  return (
    <div
      className={cn(
        "flex gap-3 mt-6",
        step > 1 ? "justify-between" : "justify-end",
      )}
    >
      {step > 1 && (
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="flex items-center gap-2 min-w-[90px]"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </Button>
      )}
      <Button
        type="button"
        onClick={onNext}
        disabled={nextDisabled || isSaving}
        className={cn(
          "flex items-center gap-2 min-w-[130px] font-semibold",
          step === 5
            ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200"
            : "bg-primary hover:bg-primary/90 text-primary-foreground",
        )}
      >
        {step === 5 ? (
          <>
            <Save className="w-4 h-4" />
            {isSaving ? "Saving…" : label}
          </>
        ) : (
          <>
            {label}
            <ChevronRight className="w-4 h-4" />
          </>
        )}
      </Button>
    </div>
  );
}

// ─── Step Cards ───────────────────────────────────────────────────────────────

function StepCard({
  children,
  title,
  description,
}: {
  children: React.ReactNode;
  title: string;
  description?: string;
}) {
  return (
    <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
          {title}
        </h3>
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}

// ─── Success Summary Card ────────────────────────────────────────────────────

interface SavedLocation {
  country: string;
  state: string;
  district: string;
  pincode: string;
  village: string;
}

function SuccessSummary({
  loc,
  onReset,
}: { loc: SavedLocation; onReset: () => void }) {
  const rows: Array<{ label: string; value: string; color: string }> = [
    { label: "Country", value: loc.country, color: "text-blue-600" },
    { label: "State", value: loc.state, color: "text-primary" },
    { label: "District", value: loc.district, color: "text-primary" },
    { label: "Pincode", value: loc.pincode, color: "text-amber-600" },
    { label: "Village / Area", value: loc.village, color: "text-emerald-600" },
  ];

  return (
    <div className="space-y-4">
      {/* Success banner */}
      <div className="rounded-2xl bg-emerald-50 border-2 border-emerald-400 p-5 shadow-md shadow-emerald-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-200">
            <Check className="w-5 h-5 text-white stroke-[3]" />
          </div>
          <div>
            <p className="text-sm font-bold text-emerald-800">
              Location Saved!
            </p>
            <p className="text-xs text-emerald-600">
              Jobs filtered to your local area
            </p>
          </div>
        </div>

        <div className="space-y-2">
          {rows.map(({ label, value, color }) => (
            <div key={label} className="flex items-start gap-3">
              <span className="text-xs font-semibold text-muted-foreground w-24 shrink-0 pt-0.5">
                {label}
              </span>
              <span className={cn("text-sm font-bold break-words", color)}>
                {value || (
                  <span className="text-muted-foreground italic font-normal">
                    —
                  </span>
                )}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Breadcrumb path */}
      <div className="rounded-xl bg-secondary/50 border border-border px-4 py-3">
        <p className="text-xs font-semibold text-muted-foreground mb-1">
          Full Path
        </p>
        <p className="text-sm text-foreground font-medium leading-relaxed break-words">
          {[loc.country, loc.state, loc.district, loc.pincode, loc.village]
            .filter(Boolean)
            .join(" › ")}
        </p>
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={onReset}
        className="w-full flex items-center gap-2 border-2 hover:border-primary/50"
      >
        <RotateCcw className="w-4 h-4" />
        Change Location
      </Button>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function LocationsPanel({ onStateFilter }: LocationsPanelProps) {
  const [step, setStep] = useState(1);
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [pincode, setPincode] = useState("");
  const [village, setVillage] = useState("");
  const [pincodeError, setPincodeError] = useState("");
  const [savedLocation, setSavedLocation] = useState<SavedLocation | null>(
    null,
  );
  const [isSaving, setIsSaving] = useState(false);

  const districts = selectedState ? (INDIA_DISTRICTS[selectedState] ?? []) : [];

  function handleBack() {
    setStep((s) => Math.max(1, s - 1));
    setPincodeError("");
  }

  function handleNext() {
    if (step === 4) {
      if (pincode.length !== 6) {
        setPincodeError("Please enter a valid 6-digit pincode.");
        return;
      }
      setPincodeError("");
    }
    if (step < 5) {
      setStep((s) => s + 1);
    }
  }

  function handleSave() {
    setIsSaving(true);
    // Simulate async save
    setTimeout(() => {
      const loc: SavedLocation = {
        country: "India",
        state: selectedState,
        district: selectedDistrict,
        pincode,
        village,
      };
      setSavedLocation(loc);
      onStateFilter(selectedState);
      setIsSaving(false);
    }, 400);
  }

  function handleReset() {
    setStep(1);
    setSelectedState("");
    setSelectedDistrict("");
    setPincode("");
    setVillage("");
    setPincodeError("");
    setSavedLocation(null);
  }

  function handleStateChange(value: string) {
    setSelectedState(value);
    setSelectedDistrict(""); // Reset district when state changes
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 pt-6 pb-2 border-b border-border">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
            <MapPin className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-xl font-display font-bold text-foreground">
            Locations
          </h2>
        </div>
        <p className="text-xs text-muted-foreground ml-12">
          {savedLocation
            ? "Your location has been saved"
            : "Set your location to find jobs near you"}
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="px-5 pb-8">
          {savedLocation ? (
            // ── Success state ──────────────────────────────────────────────
            <div className="pt-5">
              <SuccessSummary loc={savedLocation} onReset={handleReset} />
            </div>
          ) : (
            // ── Wizard state ───────────────────────────────────────────────
            <>
              {/* Step indicator */}
              <StepIndicator currentStep={step} />

              {/* Step 1: Country */}
              {step === 1 && (
                <StepCard
                  title="Step 1 — Country"
                  description="Jobs are currently available across all of India."
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/60 border border-border">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                        <Globe className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-foreground">
                          India
                        </p>
                        <p className="text-xs text-muted-foreground">
                          28 States · 8 Union Territories
                        </p>
                      </div>
                      <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground text-center pt-1">
                      Country is pre-set to India. Tap Continue to choose your
                      state.
                    </p>
                  </div>
                  <NavButtons
                    step={1}
                    onBack={handleBack}
                    onNext={handleNext}
                    nextLabel="Continue"
                  />
                </StepCard>
              )}

              {/* Step 2: State */}
              {step === 2 && (
                <StepCard
                  title="Step 2 — State"
                  description="Select the Indian state where you're looking for work."
                >
                  <div className="space-y-3">
                    <Label
                      htmlFor="state-select"
                      className="text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                    >
                      Select State
                    </Label>
                    <Select
                      value={selectedState}
                      onValueChange={handleStateChange}
                    >
                      <SelectTrigger
                        id="state-select"
                        className="w-full h-11 text-sm border-2 focus:border-primary transition-colors"
                      >
                        <SelectValue placeholder="— Choose a State —" />
                      </SelectTrigger>
                      <SelectContent className="max-h-72">
                        {ALL_STATES.map((s) => (
                          <SelectItem key={s} value={s} className="text-sm">
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {selectedState && (
                      <div className="flex items-center gap-2 text-xs text-emerald-600 font-semibold">
                        <Check className="w-3.5 h-3.5" />
                        {selectedState} — {districts.length} districts available
                      </div>
                    )}
                  </div>
                  <NavButtons
                    step={2}
                    onBack={handleBack}
                    onNext={handleNext}
                    nextDisabled={!selectedState}
                  />
                </StepCard>
              )}

              {/* Step 3: District */}
              {step === 3 && (
                <StepCard
                  title="Step 3 — District"
                  description={`Select a district within ${selectedState}.`}
                >
                  <div className="space-y-3">
                    <Label
                      htmlFor="district-select"
                      className="text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                    >
                      Select District
                    </Label>
                    <Select
                      value={selectedDistrict}
                      onValueChange={setSelectedDistrict}
                    >
                      <SelectTrigger
                        id="district-select"
                        className="w-full h-11 text-sm border-2 focus:border-primary transition-colors"
                      >
                        <SelectValue placeholder="— Choose a District —" />
                      </SelectTrigger>
                      <SelectContent className="max-h-72">
                        {districts.map((d) => (
                          <SelectItem key={d} value={d} className="text-sm">
                            {d}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {selectedDistrict && (
                      <div className="flex items-center gap-2 text-xs text-emerald-600 font-semibold">
                        <Check className="w-3.5 h-3.5" />
                        {selectedDistrict}, {selectedState}
                      </div>
                    )}
                  </div>
                  <NavButtons
                    step={3}
                    onBack={handleBack}
                    onNext={handleNext}
                    nextDisabled={!selectedDistrict}
                  />
                </StepCard>
              )}

              {/* Step 4: Pincode */}
              {step === 4 && (
                <StepCard
                  title="Step 4 — Pincode"
                  description="Enter your 6-digit area pincode."
                >
                  <div className="space-y-3">
                    <Label
                      htmlFor="pincode-input"
                      className="text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                    >
                      6-Digit Pincode
                    </Label>
                    <Input
                      id="pincode-input"
                      type="tel"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={6}
                      value={pincode}
                      placeholder="e.g. 110001"
                      className={cn(
                        "h-11 text-lg font-bold tracking-widest border-2 transition-colors",
                        pincodeError
                          ? "border-destructive focus:border-destructive"
                          : pincode.length === 6
                            ? "border-emerald-500 focus:border-emerald-500"
                            : "focus:border-primary",
                      )}
                      onChange={(e) => {
                        const val = e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 6);
                        setPincode(val);
                        if (pincodeError && val.length === 6)
                          setPincodeError("");
                      }}
                    />
                    {pincodeError ? (
                      <p className="text-xs text-destructive font-medium">
                        {pincodeError}
                      </p>
                    ) : pincode.length === 6 ? (
                      <div className="flex items-center gap-2 text-xs text-emerald-600 font-semibold">
                        <Check className="w-3.5 h-3.5" />
                        Valid pincode entered
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground">
                        {pincode.length}/6 digits entered
                      </p>
                    )}
                  </div>
                  <NavButtons
                    step={4}
                    onBack={handleBack}
                    onNext={handleNext}
                    nextDisabled={pincode.length !== 6}
                  />
                </StepCard>
              )}

              {/* Step 5: Village/Area */}
              {step === 5 && (
                <StepCard
                  title="Step 5 — Village / Area"
                  description="Enter your village or local area name (optional)."
                >
                  <div className="space-y-3">
                    <Label
                      htmlFor="village-input"
                      className="text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                    >
                      Village / Area Name
                    </Label>
                    <Input
                      id="village-input"
                      type="text"
                      value={village}
                      placeholder="e.g. Koramangala, Lajpat Nagar…"
                      className="h-11 text-sm border-2 focus:border-primary transition-colors"
                      onChange={(e) => setVillage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSave();
                      }}
                    />
                    <p className="text-xs text-muted-foreground">
                      This helps narrow down jobs to your specific locality.
                    </p>
                  </div>

                  {/* Preview summary */}
                  <div className="mt-4 rounded-xl bg-secondary/50 border border-border px-4 py-3 space-y-1.5">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                      Location Preview
                    </p>
                    {[
                      ["Country", "India"],
                      ["State", selectedState],
                      ["District", selectedDistrict],
                      ["Pincode", pincode],
                      ["Village/Area", village || "—"],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        className="flex items-center gap-2 text-xs"
                      >
                        <span className="w-20 text-muted-foreground shrink-0">
                          {label}
                        </span>
                        <span className="font-semibold text-foreground truncate">
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>

                  <NavButtons
                    step={5}
                    onBack={handleBack}
                    onNext={handleSave}
                    isSaving={isSaving}
                    nextLabel="Save Location"
                  />
                </StepCard>
              )}
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
