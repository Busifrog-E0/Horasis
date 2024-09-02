import { v2 } from '@google-cloud/translate'
import Env from "../Env.js";
import { ReadOneFromActivities, UpdateActivities } from '../databaseControllers/activities-databaseController.js';
import e from 'express';
import { ReadOneFromComments, UpdateComments } from '../databaseControllers/comments-databaseController.js';
import { ReadOneFromDiscussions, UpdateDiscussions } from '../databaseControllers/discussions-databaseController.js';
import { ReadOneFromEvents, UpdateEvents } from '../databaseControllers/events-databaseController.js';
import { ReadOneFromArticles, UpdateArticles } from '../databaseControllers/articles-databaseController.js';

const LanguageCodes = {
    "Afrikaans": "af",
    "Albanian": "sq",
    "Amharic": "am",
    "Arabic": "ar",
    "Armenian": "hy",
    "Assamese": "as",
    "Aymara": "ay",
    "Azerbaijani": "az",
    "Bambara": "bm",
    "Basque": "eu",
    "Belarusian": "be",
    "Bengali": "bn",
    "Bhojpuri": "bho",
    "Bosnian": "bs",
    "Bulgarian": "bg",
    "Catalan": "ca",
    "Cebuano": "ceb",
    "Chinese (Simplified)": "zh-CN",
    "Chinese (Traditional)": "zh-TW",
    "Corsican": "co",
    "Croatian": "hr",
    "Czech": "cs",
    "Danish": "da",
    "Dhivehi": "dv",
    "Dogri": "doi",
    "Dutch": "nl",
    "English": "en",
    "Esperanto": "eo",
    "Estonian": "et",
    "Ewe": "ee",
    "Filipino (Tagalog)": "fil",
    "Finnish": "fi",
    "French": "fr",
    "Frisian": "fy",
    "Galician": "gl",
    "Georgian": "ka",
    "German": "de",
    "Greek": "el",
    "Guarani": "gn",
    "Gujarati": "gu",
    "Haitian Creole": "ht",
    "Hausa": "ha",
    "Hawaiian": "haw",
    "Hebrew": "he",
    "Hindi": "hi",
    "Hmong": "hmn",
    "Hungarian": "hu",
    "Icelandic": "is",
    "Igbo": "ig",
    "Ilocano": "ilo",
    "Indonesian": "id",
    "Irish": "ga",
    "Italian": "it",
    "Japanese": "ja",
    "Javanese": "jv",
    "Kannada": "kn",
    "Kazakh": "kk",
    "Khmer": "km",
    "Kinyarwanda": "rw",
    "Konkani": "gom",
    "Korean": "ko",
    "Krio": "kri",
    "Kurdish": "ku",
    "Kurdish (Sorani)": "ckb",
    "Kyrgyz": "ky",
    "Lao": "lo",
    "Latin": "la",
    "Latvian": "lv",
    "Lingala": "ln",
    "Lithuanian": "lt",
    "Luganda": "lg",
    "Luxembourgish": "lb",
    "Macedonian": "mk",
    "Maithili": "mai",
    "Malagasy": "mg",
    "Malay": "ms",
    "Malayalam": "ml",
    "Maltese": "mt",
    "Maori": "mi",
    "Marathi": "mr",
    "Meiteilon (Manipuri)": "mni-Mtei",
    "Mizo": "lus",
    "Mongolian": "mn",
    "Myanmar (Burmese)": "my",
    "Nepali": "ne",
    "Norwegian": "no",
    "Nyanja (Chichewa)": "ny",
    "Odia (Oriya)": "or",
    "Oromo": "om",
    "Pashto": "ps",
    "Persian": "fa",
    "Polish": "pl",
    "Portuguese (Portugal, Brazil)": "pt",
    "Punjabi": "pa",
    "Quechua": "qu",
    "Romanian": "ro",
    "Russian": "ru",
    "Samoan": "sm",
    "Sanskrit": "sa",
    "Scots Gaelic": "gd",
    "Sepedi": "nso",
    "Serbian": "sr",
    "Sesotho": "st",
    "Shona": "sn",
    "Sindhi": "sd",
    "Sinhala (Sinhalese)": "si",
    "Slovak": "sk",
    "Slovenian": "sl",
    "Somali": "so",
    "Spanish": "es",
    "Sundanese": "su",
    "Swahili": "sw",
    "Swedish": "sv",
    "Tagalog (Filipino)": "tl",
    "Tajik": "tg",
    "Tamil": "ta",
    "Tatar": "tt",
    "Telugu": "te",
    "Thai": "th",
    "Tigrinya": "ti",
    "Tsonga": "ts",
    "Turkish": "tr",
    "Turkmen": "tk",
    "Twi (Akan)": "ak",
    "Ukrainian": "uk",
    "Urdu": "ur",
    "Uyghur": "ug",
    "Uzbek": "uz",
    "Vietnamese": "vi",
    "Welsh": "cy",
    "Xhosa": "xh",
    "Yiddish": "yi",
    "Yoruba": "yo",
    "Zulu": "zu"
}


const translate = new v2.Translate({
    projectId: "test-horissa",
    key: Env.GOOGLE_TRANSLATE_KEY
});

/**
 * 
 * @param {string} Text 
 * @param {string} TargetLanguage
 */
const TranslateText = async (Text, TargetLanguage) => {
    const [TranslatedText] = await translate.translate(Text, LanguageCodes[TargetLanguage]);
    return TranslatedText;
}

/**
 * 
 * @param {string} Text 
 * @returns 
 */
const DetectLanguage = async (Text) => {
    const [DetectedLanguage] = await translate.detect(Text);
    return Object.keys(LanguageCodes).find(key => {
        const code = LanguageCodes[key];
        return DetectedLanguage.language === code || DetectedLanguage.language.startsWith(code.split('-')[0]);
    })
}

/**
 * 
 * @param {object} Data 
 * @param {string} TargetLanguage 
 * @returns 
 */
const TranslateFieldsToLanguage = async (Data, TargetLanguage) => {
    const TranslatedFields = await Promise.all(Object.entries(Data).map(async ([Field, Text]) => {
        return [Field, await TranslateText(Text, TargetLanguage)];
    }))
    return Object.fromEntries(TranslatedFields);
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 */
const TranslateData = async (req, res) => {
    const { TargetLanguage, Type, EntityId } = req.body;
    let TranslatedContent = {};
    let OriginalContent = {};
    switch (Type) {
        case "Activity": {
            const Activity = await ReadOneFromActivities(EntityId);
            OriginalContent = { Content: Activity.Content };
            if (Activity.Languages && Activity.Languages[TargetLanguage]) {
                TranslatedContent = Activity.Languages[TargetLanguage];
            }
            else {
                const TranslatedData = await TranslateFieldsToLanguage({ Content: Activity.Content }, TargetLanguage);
                await UpdateActivities({ [`Languages.${TargetLanguage}`]: TranslatedData }, Activity.DocId);
                TranslatedContent = TranslatedData;
            }
            break;
        }
        case "Comment": {
            const Comment = await ReadOneFromComments(EntityId);
            OriginalContent = { Content: Comment.Content };
            if (Comment.Languages && Comment.Languages[TargetLanguage]) {
                TranslatedContent = Comment.Languages[TargetLanguage];
            }
            else {
                const TranslatedData = await TranslateFieldsToLanguage({ Content: Comment.Content }, TargetLanguage);
                await UpdateComments({ [`Languages.${TargetLanguage}`]: TranslatedData }, Comment.DocId);
                TranslatedContent = TranslatedData;
            }
            break;
        }
        case "Discussion": {
            const Discussion = await ReadOneFromDiscussions(EntityId);
            OriginalContent = { Description: Discussion.Description, Brief: Discussion.Brief }
            if (Discussion.Languages && Discussion.Languages[TargetLanguage]) {
                TranslatedContent = Discussion.Languages[TargetLanguage];
            }
            else {
                const TranslatedData = await TranslateFieldsToLanguage({ Description: Discussion.Description, Brief: Discussion.Brief }, TargetLanguage);
                await UpdateDiscussions({ [`Languages.${TargetLanguage}`]: TranslatedData }, Discussion.DocId);
                TranslatedContent = TranslatedData;
            }
            break;
        }
        case "Event": {
            const Event = await ReadOneFromEvents(EntityId);
            OriginalContent = { Description: Event.Description }
            if (Event.Languages && Event.Languages[TargetLanguage]) {
                TranslatedContent = Event.Languages[TargetLanguage];
            }
            else {
                const TranslatedData = await TranslateFieldsToLanguage({ Description: Event.Description }, TargetLanguage);
                await UpdateEvents({ [`Languages.${TargetLanguage}`]: TranslatedData }, Event.DocId);
                TranslatedContent = TranslatedData;
            }
            break;
        }
        case "Article": {
            const Article = await ReadOneFromArticles(EntityId);
            OriginalContent = { Description: Article.Description }
            if (Article.Languages && Article.Languages[TargetLanguage]) {
                TranslatedContent = Article.Languages[TargetLanguage];
            }
            else {
                const TranslatedData = await TranslateFieldsToLanguage({ Description: Article.Description }, TargetLanguage);
                await UpdateArticles({ [`Languages.${TargetLanguage}`]: TranslatedData }, Article.DocId);
                TranslatedContent = TranslatedData;
            }
            break;
        }
    }
    return res.json({ TranslatedContent, OriginalContent })
}

export {
    TranslateText,
    DetectLanguage,
    TranslateFieldsToLanguage,
    TranslateData
}