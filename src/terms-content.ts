// Serializable editorial data. Runtime callbacks and layout belong in sections.
import {
  footerNavigation,
  type HomepageMetadata,
  navigation,
} from "@/homepage-content"

export interface TermsHeroContent {
  breadcrumbs: readonly string[]
  effectiveDate: string
  effectiveDateLabel: string
  documentLabel: string
  documentName: string
  title: string
  description: string
}

export interface TermsDetail {
  term: string
  definition: string
}

export interface TermsSubsection {
  number: string
  title: string
  paragraphs: readonly string[]
  items?: readonly string[]
}

export type TermsBlock =
  | { type: "paragraph"; text: string }
  | { type: "list"; items: readonly string[] }
  | { type: "definitions"; items: readonly TermsDetail[] }
  | { type: "subsection"; subsection: TermsSubsection }

export interface TermsSection {
  id: string
  tocTitle: string
  title: string
  blocks: readonly TermsBlock[]
}

export interface TermsPageContent {
  hero: TermsHeroContent
  body: {
    tocLabel: string
    intro: {
      paragraphs: readonly string[]
      details: readonly TermsDetail[]
    }
    sections: readonly TermsSection[]
  }
}

export const termsPageMetadata: HomepageMetadata = {
  language: "en",
  title: "Conloca — Subscription Agreement",
  description:
    "The Conloca Subscription Agreement governing Customer access to and use of the Conloca platform and related services.",
  skipLabel: "Skip to content",
}

export const termsPageHeaderContent = {
  menuItems: navigation,
  primaryButton: { label: "Get started", url: "/" },
  secondaryButton: { label: "Try editor", url: "/" },
  logoUrl: "/",
  navigationLabel: "Primary navigation",
  mobileNavigationLabel: "Mobile navigation",
  menuButtonLabel: "Open navigation menu",
  menuCloseButtonLabel: "Close navigation menu",
}

export const termsPageFooterContent = {
  navigationItems: footerNavigation,
  action: { label: "Get started", url: "/" },
  logoUrl: "/",
  logoLabel: "Conloca home",
  navigationLabel: "Footer navigation",
}

export const termsPageContent: TermsPageContent = {
  hero: {
    breadcrumbs: ["Legal", "Terms"],
    effectiveDateLabel: "Effective date",
    effectiveDate: "(Date)",
    documentLabel: "Document",
    documentName: "Master Subscription Agreement",
    title: "Subscription Agreement",
    description:
      "The master agreement between Conloca and the customer identified in the applicable Order Form or account registration, governing access to and use of the Conloca platform and related services.",
  },
  body: {
    tocLabel: "Contents",
    intro: {
      paragraphs: [
        "This Conloca Subscription Agreement (the \u201cAgreement\u201d) is entered into between Conloca and the customer identified in the applicable Order Form or account registration (\u201cCustomer\u201d) and governs Customer\u2019s access to and use of the Conloca platform and related services (collectively, the \u201cServices\u201d).",
        "By clicking \u201cI Agree,\u201d executing an Order Form, creating an account, or accessing the Services, Customer agrees to this Agreement. If an Order Form, Enterprise Agreement, or Data Processing Addendum is executed between the parties, that document prevails over this Agreement to the extent of a direct conflict on its subject matter.",
      ],
      details: [
        { term: "Company", definition: "(Full Legal Entity Name) (\u201cConloca,\u201d \u201cCompany,\u201d \u201cwe,\u201d \u201cus,\u201d or \u201cour\u201d)" },
        { term: "Registered address", definition: "(Address)" },
        { term: "Legal contact", definition: "(Legal Email)" },
        { term: "Website", definition: "(Website URL)" },
      ],
    },
    sections: [
      {
        id: "definitions",
        tocTitle: "Definitions",
        title: "Definitions",
        blocks: [
          {
            type: "definitions",
            items: [
              {
                term: "\u201cAccount Data\u201d",
                definition:
                  "means information Conloca processes about Customer to administer the account, including account-holder names, email addresses, authentication records, billing details, subscription status, and support communications.",
              },
              {
                term: "\u201cAuthorized User\u201d",
                definition:
                  "means an individual Customer permits to access the Services under Customer\u2019s account.",
              },
              {
                term: "\u201cCustomer Data\u201d",
                definition:
                  "means content and data Customer or its Authorized Users submit to or generate through the Services, including business content, configurations, prompts, and repository content.",
              },
              {
                term: "\u201cDocumentation\u201d",
                definition:
                  "means Conloca\u2019s then-current usage guides, and the Conloca Trust & Security Documentation, made available through the Services or Conloca\u2019s website.",
              },
              {
                term: "\u201cOrder Form\u201d",
                definition:
                  "means an ordering document or online plan selection identifying the Services, plan tier, fees, and subscription term.",
              },
              {
                term: "\u201cService Data\u201d",
                definition:
                  "means operational, diagnostic, usage, performance, and security data generated through operation of the Services, excluding identifiable Customer Data except as stated in the Documentation.",
              },
              {
                term: "\u201cTrust & Security Documentation\u201d",
                definition:
                  "means Conloca\u2019s then-current description of its technical and organizational security measures, incorporated into this Agreement by reference.",
              },
            ],
          },
        ],
      },
      {
        id: "provision-of-the-services",
        tocTitle: "Provision of the Services",
        title: "Provision of the Services",
        blocks: [
          {
            type: "subsection",
            subsection: {
              number: "2.1",
              title: "Access",
              paragraphs: [
                "Conloca will make the Services available to Customer in accordance with this Agreement and the applicable Order Form during the subscription term.",
              ],
            },
          },
          {
            type: "subsection",
            subsection: {
              number: "2.2",
              title: "Conloca Commitments",
              paragraphs: [
                "Conloca will: (a) provide the Services with reasonable skill and care; (b) maintain appropriate technical and organizational security measures as described in the Trust & Security Documentation; (c) provide support in accordance with its then-current support practices or the applicable Order Form; and (d) not materially decrease the overall functionality of the Services during a paid subscription term.",
              ],
            },
          },
          {
            type: "subsection",
            subsection: {
              number: "2.3",
              title: "Scope of the Services",
              paragraphs: [
                "Conloca provides a software platform and related tooling. Conloca is not Customer\u2019s hosting provider, source-control provider, deployment environment, or internal technical team, and does not provide legal, regulatory, tax, or professional advice. Customer is responsible for determining whether the Services meet Customer\u2019s own legal, regulatory, and contractual requirements.",
              ],
            },
          },
        ],
      },
      {
        id: "license-and-restrictions",
        tocTitle: "License and Restrictions",
        title: "License and Restrictions",
        blocks: [
          {
            type: "subsection",
            subsection: {
              number: "3.1",
              title: "License Grant",
              paragraphs: [
                "Subject to this Agreement and payment of applicable fees, Conloca grants Customer a limited, non-exclusive, non-transferable, non-sublicensable right to access and use the Services during the subscription term for Customer\u2019s internal business purposes.",
              ],
            },
          },
          {
            type: "subsection",
            subsection: {
              number: "3.2",
              title: "Restrictions",
              paragraphs: [
                "Customer will not, and will not permit any third party to:",
              ],
              items: [
                "reverse engineer, decompile, or attempt to derive the source code or underlying structure of the Services, except to the extent this restriction is prohibited by applicable law;",
                "interfere with or disrupt the integrity, security, or performance of the Services;",
                "exceed agreed usage quotas or API rate limits, or impose a disproportionate load on the infrastructure;",
                "deploy automated scraping, harvesting, or benchmarking tools against the Services;",
                "circumvent or disable any security or access-control mechanism; or",
                "use the Services to build a competing product by copying Conloca\u2019s proprietary functionality or interface.",
              ],
            },
          },
        ],
      },
      {
        id: "customer-responsibilities",
        tocTitle: "Customer Responsibilities",
        title: "Customer Responsibilities",
        blocks: [
          {
            type: "paragraph",
            text: "Customer will: (a) keep its account credentials confidential and secure; (b) ensure that its Customer Data and its use of the Services comply with applicable law and do not infringe third-party rights; (c) be responsible for all activity under its account and for its Authorized Users\u2019 compliance with this Agreement; and (d) not introduce malware or malicious code into the Services.",
          },
          {
            type: "paragraph",
            text: "Customer must not use the Services to process special-category, health, payment-card, or other regulated personal data unless the parties have executed any additional agreement required for that use.",
          },
        ],
      },
      {
        id: "customer-data-and-intellectual-property",
        tocTitle: "Customer Data and Intellectual Property",
        title: "Customer Data and Intellectual Property",
        blocks: [
          {
            type: "subsection",
            subsection: {
              number: "5.1",
              title: "Customer Ownership",
              paragraphs: [
                "As between the parties, Customer retains all right, title, and interest in and to Customer Data. Nothing in this Agreement transfers ownership of Customer Data to Conloca.",
              ],
            },
          },
          {
            type: "subsection",
            subsection: {
              number: "5.2",
              title: "License to Conloca",
              paragraphs: [
                "Customer grants Conloca a limited, worldwide, royalty-free license during the term to host, process, transmit, and display Customer Data solely to provide, secure, support, and maintain the Services, including threat detection and abuse prevention.",
              ],
            },
          },
          {
            type: "subsection",
            subsection: {
              number: "5.3",
              title: "Conloca IP",
              paragraphs: [
                "Conloca retains all right, title, and interest in and to the Services, platform software, interface designs, proprietary workflows, model-orchestration logic, Documentation, and Service Data, together with all related intellectual property.",
              ],
            },
          },
          {
            type: "subsection",
            subsection: {
              number: "5.4",
              title: "Feedback",
              paragraphs: [
                "If Customer provides feedback or suggestions regarding the Services, Conloca may use that feedback without restriction or obligation.",
              ],
            },
          },
          {
            type: "subsection",
            subsection: {
              number: "5.5",
              title: "AI-Enabled Features",
              paragraphs: [
                "Where the Services include AI-enabled features, Customer Data may be processed by AI sub-processors solely to generate outputs for Customer. Conloca\u2019s use of AI sub-processors, and any applicable data-handling or no-training commitments, are described in the Trust & Security Documentation. Customer is responsible for reviewing AI-generated outputs before relying on them, and the Services are not intended for medical, legal, financial, or safety-critical decision-making without qualified human review.",
              ],
            },
          },
        ],
      },
      {
        id: "security",
        tocTitle: "Security",
        title: "Security",
        blocks: [
          {
            type: "paragraph",
            text: "Conloca maintains an information-security program with administrative, technical, and organizational safeguards designed to protect Customer Data against unauthorized access, disclosure, alteration, loss, or destruction. These measures are described in the Trust & Security Documentation, which is incorporated into this Agreement by reference and which Conloca may update from time to time, provided that Conloca will not materially reduce the overall level of security during a paid subscription term.",
          },
          {
            type: "paragraph",
            text: "If Conloca becomes aware of a confirmed security incident affecting Customer Data processed by Conloca, Conloca will notify Customer without undue delay and provide information reasonably available to Conloca regarding the incident, consistent with the Trust & Security Documentation.",
          },
        ],
      },
      {
        id: "data-protection",
        tocTitle: "Data Protection",
        title: "Data Protection",
        blocks: [
          {
            type: "paragraph",
            text: "Conloca\u2019s processing of personal data that Conloca determines the purposes and means of \u2014 such as Account Data \u2014 is governed by the Conloca Privacy Policy, available at [Privacy Policy URL].",
          },
          {
            type: "paragraph",
            text: "To the extent Conloca processes personal data on Customer\u2019s behalf as a processor under applicable data-protection law, the parties will execute a Data Processing Addendum, which will be incorporated into this Agreement by reference. As of the Effective Date, the Services are not designed for Customer to route third-party personal data to Conloca for processing on Customer\u2019s behalf.",
          },
        ],
      },
      {
        id: "fees-billing-and-renewal",
        tocTitle: "Fees, Billing, and Renewal",
        title: "Fees, Billing, and Renewal",
        blocks: [
          {
            type: "subsection",
            subsection: {
              number: "8.1",
              title: "Fees and Plans",
              paragraphs: [
                "Fees, the subscription term, usage limits, and the features included in Customer\u2019s subscription are set out in the applicable Order Form. Where Customer subscribes online, Customer\u2019s online plan selection and checkout together constitute the Order Form.",
              ],
            },
          },
          {
            type: "subsection",
            subsection: {
              number: "8.2",
              title: "Billing and Taxes",
              paragraphs: [
                "Customer authorizes Conloca and its payment processor to charge all applicable fees, taxes, and recurring charges to Customer\u2019s designated payment method. Fees are exclusive of taxes, and Customer is responsible for all taxes other than those based on Conloca\u2019s net income.",
              ],
            },
          },
          {
            type: "subsection",
            subsection: {
              number: "8.3",
              title: "Automatic Renewal",
              paragraphs: [
                "Unless an Order Form states otherwise, paid subscriptions automatically renew for successive periods equal to the preceding term unless either party cancels before the applicable renewal date.",
              ],
            },
          },
          {
            type: "subsection",
            subsection: {
              number: "8.4",
              title: "Non-Refundable",
              paragraphs: [
                "Except where required by law or expressly stated in an Order Form, fees are non-refundable.",
              ],
            },
          },
          {
            type: "subsection",
            subsection: {
              number: "8.5",
              title: "Non-Payment",
              paragraphs: [
                "If payment fails or remains overdue, Conloca may suspend or restrict access to paid Services after providing notice where reasonably practicable, and may restore access once amounts due are paid.",
              ],
            },
          },
        ],
      },
      {
        id: "term-and-termination",
        tocTitle: "Term and Termination",
        title: "Term and Termination",
        blocks: [
          {
            type: "subsection",
            subsection: {
              number: "9.1",
              title: "Term",
              paragraphs: [
                "This Agreement begins on the Effective Date and continues until all subscriptions have expired or the Agreement is terminated.",
              ],
            },
          },
          {
            type: "subsection",
            subsection: {
              number: "9.2",
              title: "Termination for Cause",
              paragraphs: [
                "Either party may terminate this Agreement for cause if the other party materially breaches this Agreement and fails to cure within thirty (30) days after written notice.",
              ],
            },
          },
          {
            type: "subsection",
            subsection: {
              number: "9.3",
              title: "Suspension",
              paragraphs: [
                "Conloca may suspend or restrict access without prior notice where necessary to address a material security, legal, or operational risk, or suspected fraud or abuse, and will restore access once the risk is resolved.",
              ],
            },
          },
          {
            type: "subsection",
            subsection: {
              number: "9.4",
              title: "Effect of Termination",
              paragraphs: [
                "Upon termination, Customer\u2019s right to use the Services ends. Conloca will handle deletion and retention of Account Data and Service Data as described in the Trust & Security Documentation and the Privacy Policy. Sections relating to ownership, confidentiality, fees accrued, disclaimers, limitation of liability, indemnification, and governing law survive termination.",
              ],
            },
          },
        ],
      },
      {
        id: "confidentiality",
        tocTitle: "Confidentiality",
        title: "Confidentiality",
        blocks: [
          {
            type: "paragraph",
            text: "Each party (as \u201cReceiving Party\u201d) will protect the other party\u2019s Confidential Information using at least the same degree of care it uses for its own confidential information of like kind, and no less than a commercially reasonable standard. The Receiving Party will use Confidential Information only to exercise its rights and perform its obligations under this Agreement and will limit disclosure to personnel, advisers, and subcontractors bound by confidentiality obligations on a need-to-know basis.",
          },
          {
            type: "paragraph",
            text: "Confidential Information excludes information that is publicly available without breach, lawfully known before disclosure, independently developed, or lawfully received from a third party. A party may disclose Confidential Information where legally required, giving prior notice where permitted.",
          },
        ],
      },
      {
        id: "warranties-and-disclaimer",
        tocTitle: "Warranties and Disclaimer",
        title: "Warranties and Disclaimer",
        blocks: [
          {
            type: "paragraph",
            text: "Conloca warrants that it will provide the Services with reasonable skill and care. Except as expressly stated in this Agreement, and to the maximum extent permitted by law, the Services are provided \u201cas is\u201d and \u201cas available,\u201d and Conloca disclaims all other warranties, express or implied, including merchantability, fitness for a particular purpose, title, and non-infringement.",
          },
          {
            type: "paragraph",
            text: "Conloca does not warrant that the Services will be uninterrupted, error-free, or completely secure, or that AI-generated outputs will be accurate or suitable for any particular purpose.",
          },
        ],
      },
      {
        id: "limitation-of-liability",
        tocTitle: "Limitation of Liability",
        title: "Limitation of Liability",
        blocks: [
          {
            type: "paragraph",
            text: "To the maximum extent permitted by law, neither party will be liable for indirect, incidental, special, consequential, exemplary, or punitive damages, or for lost profits, revenue, goodwill, or data, arising out of or relating to this Agreement, regardless of the theory of liability and even if advised of the possibility of such damages.",
          },
          {
            type: "paragraph",
            text: "To the maximum extent permitted by law, Conloca\u2019s total aggregate liability arising out of or relating to this Agreement will not exceed the total fees paid or payable by Customer to Conloca for the Services in the twelve (12) months preceding the event giving rise to the claim.",
          },
          {
            type: "paragraph",
            text: "Nothing in this Agreement limits liability that cannot lawfully be excluded or limited.",
          },
        ],
      },
      {
        id: "indemnification",
        tocTitle: "Indemnification",
        title: "Indemnification",
        blocks: [
          {
            type: "paragraph",
            text: "Customer will defend, indemnify, and hold harmless Conloca and its affiliates, officers, and employees from third-party claims, damages, liabilities, costs, and expenses (including reasonable attorneys\u2019 fees) arising from: (a) Customer Data; (b) Customer\u2019s breach of this Agreement; (c) Customer\u2019s misuse of the Services; or (d) Customer\u2019s violation of law or third-party rights.",
          },
          {
            type: "paragraph",
            text: "Any additional intellectual-property indemnity, service-level commitment, or enterprise-specific liability arrangement applies only if expressly stated in an executed Order Form.",
          },
        ],
      },
      {
        id: "general",
        tocTitle: "General",
        title: "General",
        blocks: [
          {
            type: "subsection",
            subsection: {
              number: "14.1",
              title: "Changes to the Agreement",
              paragraphs: [
                "Conloca may update this Agreement from time to time. Where a change materially reduces Customer\u2019s rights, Conloca will provide reasonable advance notice, and Customer\u2019s continued use after the effective date constitutes acceptance, except where a change is required immediately for legal or security reasons.",
              ],
            },
          },
          {
            type: "subsection",
            subsection: {
              number: "14.2",
              title: "Governing Law and Jurisdiction",
              paragraphs: [
                "This Agreement is governed by the laws of the Hong Kong Special Administrative Region of the People\u2019s Republic of China, and the parties submit to the exclusive jurisdiction of the courts located in Hong Kong. Nothing prevents either party from seeking urgent injunctive relief in any court of competent jurisdiction.",
              ],
            },
          },
          {
            type: "subsection",
            subsection: {
              number: "14.3",
              title: "Force Majeure",
              paragraphs: [
                "Neither party is liable for delay or failure to perform (other than payment obligations) caused by circumstances beyond its reasonable control, including natural disasters, war, cyberattacks, denial-of-service attacks, internet or utility failures, or third-party platform outages.",
              ],
            },
          },
          {
            type: "subsection",
            subsection: {
              number: "14.4",
              title: "Assignment",
              paragraphs: [
                "Customer may not assign this Agreement without Conloca\u2019s prior written consent, except to a successor in a merger or sale of substantially all assets. Conloca may assign this Agreement in connection with a merger, financing, reorganization, or sale of assets.",
              ],
            },
          },
          {
            type: "subsection",
            subsection: {
              number: "14.5",
              title: "Entire Agreement; Severability; Waiver",
              paragraphs: [
                "This Agreement, together with the Documentation, Privacy Policy, any Order Form, and any Data Processing Addendum, is the entire agreement between the parties on its subject matter and supersedes prior agreements. If any provision is held unenforceable, it will be modified to the minimum extent necessary and the remaining provisions remain in effect. Failure to enforce a provision is not a waiver.",
              ],
            },
          },
          {
            type: "subsection",
            subsection: {
              number: "14.6",
              title: "Notices",
              paragraphs: [
                "Notices to Conloca must be sent to [Legal Email]. Notices to Customer may be sent to the email associated with Customer\u2019s account or delivered through the Services.",
              ],
            },
          },
        ],
      },
    ],
  },
}
