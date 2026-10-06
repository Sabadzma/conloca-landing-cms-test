import type { ComponentConfig } from "@puckeditor/core"
import {
  TermsPageSections,
  type TermsBlock,
  type TermsPageContent,
} from "@/sections/terms-page-sections"

// Puck-storable props for TermsPageSections. TermsBlock is a discriminated
// union which Puck array fields cannot express per item, so each block item
// carries a flat shape with ALL payloads present and the mapper picks the
// relevant payload by `type`.
export interface TermsSubsectionProps {
  number: string
  title: string
  paragraphs: { text: string }[]
  items: { text: string }[]
}

export interface TermsBlockProps {
  type: "paragraph" | "list" | "definitions" | "subsection"
  text: string
  items: { text: string }[]
  definitions: { term: string; definition: string }[]
  subsection: TermsSubsectionProps
}

export interface TermsSectionProps {
  id: string
  tocTitle: string
  title: string
  blocks: TermsBlockProps[]
}

export interface TermsPageSectionsBlockProps {
  hero: {
    breadcrumbs: { text: string }[]
    effectiveDate: string
    effectiveDateLabel: string
    documentLabel: string
    documentName: string
    title: string
    description: string
  }
  body: {
    tocLabel: string
    intro: {
      paragraphs: { text: string }[]
      details: { term: string; definition: string }[]
    }
    sections: TermsSectionProps[]
  }
}

function mapTermsBlock(block: TermsBlockProps): TermsBlock {
  switch (block.type) {
    case "paragraph":
      return { type: "paragraph", text: block.text }
    case "list":
      return { type: "list", items: block.items.map((item) => item.text) }
    case "definitions":
      return { type: "definitions", items: block.definitions }
    case "subsection": {
      const subsection = block.subsection
      return {
        type: "subsection",
        subsection: {
          number: subsection.number,
          title: subsection.title,
          paragraphs: subsection.paragraphs.map((item) => item.text),
          // TermsSubsection.items is optional; an empty editor array means
          // the payload is absent.
          ...(subsection.items.length > 0
            ? { items: subsection.items.map((item) => item.text) }
            : {}),
        },
      }
    }
    default: {
      const exhaustive: never = block.type
      throw new Error(`Unknown terms block type: ${String(exhaustive)}`)
    }
  }
}

export function mapTermsPageSectionsProps(
  props: TermsPageSectionsBlockProps,
): TermsPageContent {
  return {
    hero: {
      breadcrumbs: props.hero.breadcrumbs.map((item) => item.text),
      effectiveDate: props.hero.effectiveDate,
      effectiveDateLabel: props.hero.effectiveDateLabel,
      documentLabel: props.hero.documentLabel,
      documentName: props.hero.documentName,
      title: props.hero.title,
      description: props.hero.description,
    },
    body: {
      tocLabel: props.body.tocLabel,
      intro: {
        paragraphs: props.body.intro.paragraphs.map((item) => item.text),
        details: props.body.intro.details,
      },
      sections: props.body.sections.map((section) => ({
        id: section.id,
        tocTitle: section.tocTitle,
        title: section.title,
        blocks: section.blocks.map(mapTermsBlock),
      })),
    },
  }
}

const textListFields = {
  type: "array",
  arrayFields: {
    text: { type: "textarea" },
  },
  getItemSummary: (item: { text: string }) => item.text,
} as const

const termsDetailFields = {
  type: "array",
  arrayFields: {
    term: { type: "text" },
    definition: { type: "textarea" },
  },
  getItemSummary: (item: { term: string }) => item.term,
} as const

export const termsPageSectionsDefaultProps: TermsPageSectionsBlockProps =
  {
    "hero": {
      "breadcrumbs": [
        {
          "text": "Legal"
        },
        {
          "text": "Terms"
        }
      ],
      "effectiveDate": "(Date)",
      "effectiveDateLabel": "Effective date",
      "documentLabel": "Document",
      "documentName": "Master Subscription Agreement",
      "title": "Subscription Agreement",
      "description": "The master agreement between Conloca and the customer identified in the applicable Order Form or account registration, governing access to and use of the Conloca platform and related services."
    },
    "body": {
      "tocLabel": "Contents",
      "intro": {
        "paragraphs": [
          {
            "text": "This Conloca Subscription Agreement (the “Agreement”) is entered into between Conloca and the customer identified in the applicable Order Form or account registration (“Customer”) and governs Customer’s access to and use of the Conloca platform and related services (collectively, the “Services”)."
          },
          {
            "text": "By clicking “I Agree,” executing an Order Form, creating an account, or accessing the Services, Customer agrees to this Agreement. If an Order Form, Enterprise Agreement, or Data Processing Addendum is executed between the parties, that document prevails over this Agreement to the extent of a direct conflict on its subject matter."
          }
        ],
        "details": [
          {
            "term": "Company",
            "definition": "(Full Legal Entity Name) (“Conloca,” “Company,” “we,” “us,” or “our”)"
          },
          {
            "term": "Registered address",
            "definition": "(Address)"
          },
          {
            "term": "Legal contact",
            "definition": "(Legal Email)"
          },
          {
            "term": "Website",
            "definition": "(Website URL)"
          }
        ]
      },
      "sections": [
        {
          "id": "definitions",
          "tocTitle": "Definitions",
          "title": "Definitions",
          "blocks": [
            {
              "type": "definitions",
              "text": "",
              "items": [],
              "definitions": [
                {
                  "term": "“Account Data”",
                  "definition": "means information Conloca processes about Customer to administer the account, including account-holder names, email addresses, authentication records, billing details, subscription status, and support communications."
                },
                {
                  "term": "“Authorized User”",
                  "definition": "means an individual Customer permits to access the Services under Customer’s account."
                },
                {
                  "term": "“Customer Data”",
                  "definition": "means content and data Customer or its Authorized Users submit to or generate through the Services, including business content, configurations, prompts, and repository content."
                },
                {
                  "term": "“Documentation”",
                  "definition": "means Conloca’s then-current usage guides, and the Conloca Trust & Security Documentation, made available through the Services or Conloca’s website."
                },
                {
                  "term": "“Order Form”",
                  "definition": "means an ordering document or online plan selection identifying the Services, plan tier, fees, and subscription term."
                },
                {
                  "term": "“Service Data”",
                  "definition": "means operational, diagnostic, usage, performance, and security data generated through operation of the Services, excluding identifiable Customer Data except as stated in the Documentation."
                },
                {
                  "term": "“Trust & Security Documentation”",
                  "definition": "means Conloca’s then-current description of its technical and organizational security measures, incorporated into this Agreement by reference."
                }
              ],
              "subsection": {
                "number": "",
                "title": "",
                "paragraphs": [],
                "items": []
              }
            }
          ]
        },
        {
          "id": "provision-of-the-services",
          "tocTitle": "Provision of the Services",
          "title": "Provision of the Services",
          "blocks": [
            {
              "type": "subsection",
              "text": "",
              "items": [],
              "definitions": [],
              "subsection": {
                "number": "2.1",
                "title": "Access",
                "paragraphs": [
                  {
                    "text": "Conloca will make the Services available to Customer in accordance with this Agreement and the applicable Order Form during the subscription term."
                  }
                ],
                "items": []
              }
            },
            {
              "type": "subsection",
              "text": "",
              "items": [],
              "definitions": [],
              "subsection": {
                "number": "2.2",
                "title": "Conloca Commitments",
                "paragraphs": [
                  {
                    "text": "Conloca will: (a) provide the Services with reasonable skill and care; (b) maintain appropriate technical and organizational security measures as described in the Trust & Security Documentation; (c) provide support in accordance with its then-current support practices or the applicable Order Form; and (d) not materially decrease the overall functionality of the Services during a paid subscription term."
                  }
                ],
                "items": []
              }
            },
            {
              "type": "subsection",
              "text": "",
              "items": [],
              "definitions": [],
              "subsection": {
                "number": "2.3",
                "title": "Scope of the Services",
                "paragraphs": [
                  {
                    "text": "Conloca provides a software platform and related tooling. Conloca is not Customer’s hosting provider, source-control provider, deployment environment, or internal technical team, and does not provide legal, regulatory, tax, or professional advice. Customer is responsible for determining whether the Services meet Customer’s own legal, regulatory, and contractual requirements."
                  }
                ],
                "items": []
              }
            }
          ]
        },
        {
          "id": "license-and-restrictions",
          "tocTitle": "License and Restrictions",
          "title": "License and Restrictions",
          "blocks": [
            {
              "type": "subsection",
              "text": "",
              "items": [],
              "definitions": [],
              "subsection": {
                "number": "3.1",
                "title": "License Grant",
                "paragraphs": [
                  {
                    "text": "Subject to this Agreement and payment of applicable fees, Conloca grants Customer a limited, non-exclusive, non-transferable, non-sublicensable right to access and use the Services during the subscription term for Customer’s internal business purposes."
                  }
                ],
                "items": []
              }
            },
            {
              "type": "subsection",
              "text": "",
              "items": [],
              "definitions": [],
              "subsection": {
                "number": "3.2",
                "title": "Restrictions",
                "paragraphs": [
                  {
                    "text": "Customer will not, and will not permit any third party to:"
                  }
                ],
                "items": [
                  {
                    "text": "reverse engineer, decompile, or attempt to derive the source code or underlying structure of the Services, except to the extent this restriction is prohibited by applicable law;"
                  },
                  {
                    "text": "interfere with or disrupt the integrity, security, or performance of the Services;"
                  },
                  {
                    "text": "exceed agreed usage quotas or API rate limits, or impose a disproportionate load on the infrastructure;"
                  },
                  {
                    "text": "deploy automated scraping, harvesting, or benchmarking tools against the Services;"
                  },
                  {
                    "text": "circumvent or disable any security or access-control mechanism; or"
                  },
                  {
                    "text": "use the Services to build a competing product by copying Conloca’s proprietary functionality or interface."
                  }
                ]
              }
            }
          ]
        },
        {
          "id": "customer-responsibilities",
          "tocTitle": "Customer Responsibilities",
          "title": "Customer Responsibilities",
          "blocks": [
            {
              "type": "paragraph",
              "text": "Customer will: (a) keep its account credentials confidential and secure; (b) ensure that its Customer Data and its use of the Services comply with applicable law and do not infringe third-party rights; (c) be responsible for all activity under its account and for its Authorized Users’ compliance with this Agreement; and (d) not introduce malware or malicious code into the Services.",
              "items": [],
              "definitions": [],
              "subsection": {
                "number": "",
                "title": "",
                "paragraphs": [],
                "items": []
              }
            },
            {
              "type": "paragraph",
              "text": "Customer must not use the Services to process special-category, health, payment-card, or other regulated personal data unless the parties have executed any additional agreement required for that use.",
              "items": [],
              "definitions": [],
              "subsection": {
                "number": "",
                "title": "",
                "paragraphs": [],
                "items": []
              }
            }
          ]
        },
        {
          "id": "customer-data-and-intellectual-property",
          "tocTitle": "Customer Data and Intellectual Property",
          "title": "Customer Data and Intellectual Property",
          "blocks": [
            {
              "type": "subsection",
              "text": "",
              "items": [],
              "definitions": [],
              "subsection": {
                "number": "5.1",
                "title": "Customer Ownership",
                "paragraphs": [
                  {
                    "text": "As between the parties, Customer retains all right, title, and interest in and to Customer Data. Nothing in this Agreement transfers ownership of Customer Data to Conloca."
                  }
                ],
                "items": []
              }
            },
            {
              "type": "subsection",
              "text": "",
              "items": [],
              "definitions": [],
              "subsection": {
                "number": "5.2",
                "title": "License to Conloca",
                "paragraphs": [
                  {
                    "text": "Customer grants Conloca a limited, worldwide, royalty-free license during the term to host, process, transmit, and display Customer Data solely to provide, secure, support, and maintain the Services, including threat detection and abuse prevention."
                  }
                ],
                "items": []
              }
            },
            {
              "type": "subsection",
              "text": "",
              "items": [],
              "definitions": [],
              "subsection": {
                "number": "5.3",
                "title": "Conloca IP",
                "paragraphs": [
                  {
                    "text": "Conloca retains all right, title, and interest in and to the Services, platform software, interface designs, proprietary workflows, model-orchestration logic, Documentation, and Service Data, together with all related intellectual property."
                  }
                ],
                "items": []
              }
            },
            {
              "type": "subsection",
              "text": "",
              "items": [],
              "definitions": [],
              "subsection": {
                "number": "5.4",
                "title": "Feedback",
                "paragraphs": [
                  {
                    "text": "If Customer provides feedback or suggestions regarding the Services, Conloca may use that feedback without restriction or obligation."
                  }
                ],
                "items": []
              }
            },
            {
              "type": "subsection",
              "text": "",
              "items": [],
              "definitions": [],
              "subsection": {
                "number": "5.5",
                "title": "AI-Enabled Features",
                "paragraphs": [
                  {
                    "text": "Where the Services include AI-enabled features, Customer Data may be processed by AI sub-processors solely to generate outputs for Customer. Conloca’s use of AI sub-processors, and any applicable data-handling or no-training commitments, are described in the Trust & Security Documentation. Customer is responsible for reviewing AI-generated outputs before relying on them, and the Services are not intended for medical, legal, financial, or safety-critical decision-making without qualified human review."
                  }
                ],
                "items": []
              }
            }
          ]
        },
        {
          "id": "security",
          "tocTitle": "Security",
          "title": "Security",
          "blocks": [
            {
              "type": "paragraph",
              "text": "Conloca maintains an information-security program with administrative, technical, and organizational safeguards designed to protect Customer Data against unauthorized access, disclosure, alteration, loss, or destruction. These measures are described in the Trust & Security Documentation, which is incorporated into this Agreement by reference and which Conloca may update from time to time, provided that Conloca will not materially reduce the overall level of security during a paid subscription term.",
              "items": [],
              "definitions": [],
              "subsection": {
                "number": "",
                "title": "",
                "paragraphs": [],
                "items": []
              }
            },
            {
              "type": "paragraph",
              "text": "If Conloca becomes aware of a confirmed security incident affecting Customer Data processed by Conloca, Conloca will notify Customer without undue delay and provide information reasonably available to Conloca regarding the incident, consistent with the Trust & Security Documentation.",
              "items": [],
              "definitions": [],
              "subsection": {
                "number": "",
                "title": "",
                "paragraphs": [],
                "items": []
              }
            }
          ]
        },
        {
          "id": "data-protection",
          "tocTitle": "Data Protection",
          "title": "Data Protection",
          "blocks": [
            {
              "type": "paragraph",
              "text": "Conloca’s processing of personal data that Conloca determines the purposes and means of — such as Account Data — is governed by the Conloca Privacy Policy, available at [Privacy Policy URL].",
              "items": [],
              "definitions": [],
              "subsection": {
                "number": "",
                "title": "",
                "paragraphs": [],
                "items": []
              }
            },
            {
              "type": "paragraph",
              "text": "To the extent Conloca processes personal data on Customer’s behalf as a processor under applicable data-protection law, the parties will execute a Data Processing Addendum, which will be incorporated into this Agreement by reference. As of the Effective Date, the Services are not designed for Customer to route third-party personal data to Conloca for processing on Customer’s behalf.",
              "items": [],
              "definitions": [],
              "subsection": {
                "number": "",
                "title": "",
                "paragraphs": [],
                "items": []
              }
            }
          ]
        },
        {
          "id": "fees-billing-and-renewal",
          "tocTitle": "Fees, Billing, and Renewal",
          "title": "Fees, Billing, and Renewal",
          "blocks": [
            {
              "type": "subsection",
              "text": "",
              "items": [],
              "definitions": [],
              "subsection": {
                "number": "8.1",
                "title": "Fees and Plans",
                "paragraphs": [
                  {
                    "text": "Fees, the subscription term, usage limits, and the features included in Customer’s subscription are set out in the applicable Order Form. Where Customer subscribes online, Customer’s online plan selection and checkout together constitute the Order Form."
                  }
                ],
                "items": []
              }
            },
            {
              "type": "subsection",
              "text": "",
              "items": [],
              "definitions": [],
              "subsection": {
                "number": "8.2",
                "title": "Billing and Taxes",
                "paragraphs": [
                  {
                    "text": "Customer authorizes Conloca and its payment processor to charge all applicable fees, taxes, and recurring charges to Customer’s designated payment method. Fees are exclusive of taxes, and Customer is responsible for all taxes other than those based on Conloca’s net income."
                  }
                ],
                "items": []
              }
            },
            {
              "type": "subsection",
              "text": "",
              "items": [],
              "definitions": [],
              "subsection": {
                "number": "8.3",
                "title": "Automatic Renewal",
                "paragraphs": [
                  {
                    "text": "Unless an Order Form states otherwise, paid subscriptions automatically renew for successive periods equal to the preceding term unless either party cancels before the applicable renewal date."
                  }
                ],
                "items": []
              }
            },
            {
              "type": "subsection",
              "text": "",
              "items": [],
              "definitions": [],
              "subsection": {
                "number": "8.4",
                "title": "Non-Refundable",
                "paragraphs": [
                  {
                    "text": "Except where required by law or expressly stated in an Order Form, fees are non-refundable."
                  }
                ],
                "items": []
              }
            },
            {
              "type": "subsection",
              "text": "",
              "items": [],
              "definitions": [],
              "subsection": {
                "number": "8.5",
                "title": "Non-Payment",
                "paragraphs": [
                  {
                    "text": "If payment fails or remains overdue, Conloca may suspend or restrict access to paid Services after providing notice where reasonably practicable, and may restore access once amounts due are paid."
                  }
                ],
                "items": []
              }
            }
          ]
        },
        {
          "id": "term-and-termination",
          "tocTitle": "Term and Termination",
          "title": "Term and Termination",
          "blocks": [
            {
              "type": "subsection",
              "text": "",
              "items": [],
              "definitions": [],
              "subsection": {
                "number": "9.1",
                "title": "Term",
                "paragraphs": [
                  {
                    "text": "This Agreement begins on the Effective Date and continues until all subscriptions have expired or the Agreement is terminated."
                  }
                ],
                "items": []
              }
            },
            {
              "type": "subsection",
              "text": "",
              "items": [],
              "definitions": [],
              "subsection": {
                "number": "9.2",
                "title": "Termination for Cause",
                "paragraphs": [
                  {
                    "text": "Either party may terminate this Agreement for cause if the other party materially breaches this Agreement and fails to cure within thirty (30) days after written notice."
                  }
                ],
                "items": []
              }
            },
            {
              "type": "subsection",
              "text": "",
              "items": [],
              "definitions": [],
              "subsection": {
                "number": "9.3",
                "title": "Suspension",
                "paragraphs": [
                  {
                    "text": "Conloca may suspend or restrict access without prior notice where necessary to address a material security, legal, or operational risk, or suspected fraud or abuse, and will restore access once the risk is resolved."
                  }
                ],
                "items": []
              }
            },
            {
              "type": "subsection",
              "text": "",
              "items": [],
              "definitions": [],
              "subsection": {
                "number": "9.4",
                "title": "Effect of Termination",
                "paragraphs": [
                  {
                    "text": "Upon termination, Customer’s right to use the Services ends. Conloca will handle deletion and retention of Account Data and Service Data as described in the Trust & Security Documentation and the Privacy Policy. Sections relating to ownership, confidentiality, fees accrued, disclaimers, limitation of liability, indemnification, and governing law survive termination."
                  }
                ],
                "items": []
              }
            }
          ]
        },
        {
          "id": "confidentiality",
          "tocTitle": "Confidentiality",
          "title": "Confidentiality",
          "blocks": [
            {
              "type": "paragraph",
              "text": "Each party (as “Receiving Party”) will protect the other party’s Confidential Information using at least the same degree of care it uses for its own confidential information of like kind, and no less than a commercially reasonable standard. The Receiving Party will use Confidential Information only to exercise its rights and perform its obligations under this Agreement and will limit disclosure to personnel, advisers, and subcontractors bound by confidentiality obligations on a need-to-know basis.",
              "items": [],
              "definitions": [],
              "subsection": {
                "number": "",
                "title": "",
                "paragraphs": [],
                "items": []
              }
            },
            {
              "type": "paragraph",
              "text": "Confidential Information excludes information that is publicly available without breach, lawfully known before disclosure, independently developed, or lawfully received from a third party. A party may disclose Confidential Information where legally required, giving prior notice where permitted.",
              "items": [],
              "definitions": [],
              "subsection": {
                "number": "",
                "title": "",
                "paragraphs": [],
                "items": []
              }
            }
          ]
        },
        {
          "id": "warranties-and-disclaimer",
          "tocTitle": "Warranties and Disclaimer",
          "title": "Warranties and Disclaimer",
          "blocks": [
            {
              "type": "paragraph",
              "text": "Conloca warrants that it will provide the Services with reasonable skill and care. Except as expressly stated in this Agreement, and to the maximum extent permitted by law, the Services are provided “as is” and “as available,” and Conloca disclaims all other warranties, express or implied, including merchantability, fitness for a particular purpose, title, and non-infringement.",
              "items": [],
              "definitions": [],
              "subsection": {
                "number": "",
                "title": "",
                "paragraphs": [],
                "items": []
              }
            },
            {
              "type": "paragraph",
              "text": "Conloca does not warrant that the Services will be uninterrupted, error-free, or completely secure, or that AI-generated outputs will be accurate or suitable for any particular purpose.",
              "items": [],
              "definitions": [],
              "subsection": {
                "number": "",
                "title": "",
                "paragraphs": [],
                "items": []
              }
            }
          ]
        },
        {
          "id": "limitation-of-liability",
          "tocTitle": "Limitation of Liability",
          "title": "Limitation of Liability",
          "blocks": [
            {
              "type": "paragraph",
              "text": "To the maximum extent permitted by law, neither party will be liable for indirect, incidental, special, consequential, exemplary, or punitive damages, or for lost profits, revenue, goodwill, or data, arising out of or relating to this Agreement, regardless of the theory of liability and even if advised of the possibility of such damages.",
              "items": [],
              "definitions": [],
              "subsection": {
                "number": "",
                "title": "",
                "paragraphs": [],
                "items": []
              }
            },
            {
              "type": "paragraph",
              "text": "To the maximum extent permitted by law, Conloca’s total aggregate liability arising out of or relating to this Agreement will not exceed the total fees paid or payable by Customer to Conloca for the Services in the twelve (12) months preceding the event giving rise to the claim.",
              "items": [],
              "definitions": [],
              "subsection": {
                "number": "",
                "title": "",
                "paragraphs": [],
                "items": []
              }
            },
            {
              "type": "paragraph",
              "text": "Nothing in this Agreement limits liability that cannot lawfully be excluded or limited.",
              "items": [],
              "definitions": [],
              "subsection": {
                "number": "",
                "title": "",
                "paragraphs": [],
                "items": []
              }
            }
          ]
        },
        {
          "id": "indemnification",
          "tocTitle": "Indemnification",
          "title": "Indemnification",
          "blocks": [
            {
              "type": "paragraph",
              "text": "Customer will defend, indemnify, and hold harmless Conloca and its affiliates, officers, and employees from third-party claims, damages, liabilities, costs, and expenses (including reasonable attorneys’ fees) arising from: (a) Customer Data; (b) Customer’s breach of this Agreement; (c) Customer’s misuse of the Services; or (d) Customer’s violation of law or third-party rights.",
              "items": [],
              "definitions": [],
              "subsection": {
                "number": "",
                "title": "",
                "paragraphs": [],
                "items": []
              }
            },
            {
              "type": "paragraph",
              "text": "Any additional intellectual-property indemnity, service-level commitment, or enterprise-specific liability arrangement applies only if expressly stated in an executed Order Form.",
              "items": [],
              "definitions": [],
              "subsection": {
                "number": "",
                "title": "",
                "paragraphs": [],
                "items": []
              }
            }
          ]
        },
        {
          "id": "general",
          "tocTitle": "General",
          "title": "General",
          "blocks": [
            {
              "type": "subsection",
              "text": "",
              "items": [],
              "definitions": [],
              "subsection": {
                "number": "14.1",
                "title": "Changes to the Agreement",
                "paragraphs": [
                  {
                    "text": "Conloca may update this Agreement from time to time. Where a change materially reduces Customer’s rights, Conloca will provide reasonable advance notice, and Customer’s continued use after the effective date constitutes acceptance, except where a change is required immediately for legal or security reasons."
                  }
                ],
                "items": []
              }
            },
            {
              "type": "subsection",
              "text": "",
              "items": [],
              "definitions": [],
              "subsection": {
                "number": "14.2",
                "title": "Governing Law and Jurisdiction",
                "paragraphs": [
                  {
                    "text": "This Agreement is governed by the laws of the Hong Kong Special Administrative Region of the People’s Republic of China, and the parties submit to the exclusive jurisdiction of the courts located in Hong Kong. Nothing prevents either party from seeking urgent injunctive relief in any court of competent jurisdiction."
                  }
                ],
                "items": []
              }
            },
            {
              "type": "subsection",
              "text": "",
              "items": [],
              "definitions": [],
              "subsection": {
                "number": "14.3",
                "title": "Force Majeure",
                "paragraphs": [
                  {
                    "text": "Neither party is liable for delay or failure to perform (other than payment obligations) caused by circumstances beyond its reasonable control, including natural disasters, war, cyberattacks, denial-of-service attacks, internet or utility failures, or third-party platform outages."
                  }
                ],
                "items": []
              }
            },
            {
              "type": "subsection",
              "text": "",
              "items": [],
              "definitions": [],
              "subsection": {
                "number": "14.4",
                "title": "Assignment",
                "paragraphs": [
                  {
                    "text": "Customer may not assign this Agreement without Conloca’s prior written consent, except to a successor in a merger or sale of substantially all assets. Conloca may assign this Agreement in connection with a merger, financing, reorganization, or sale of assets."
                  }
                ],
                "items": []
              }
            },
            {
              "type": "subsection",
              "text": "",
              "items": [],
              "definitions": [],
              "subsection": {
                "number": "14.5",
                "title": "Entire Agreement; Severability; Waiver",
                "paragraphs": [
                  {
                    "text": "This Agreement, together with the Documentation, Privacy Policy, any Order Form, and any Data Processing Addendum, is the entire agreement between the parties on its subject matter and supersedes prior agreements. If any provision is held unenforceable, it will be modified to the minimum extent necessary and the remaining provisions remain in effect. Failure to enforce a provision is not a waiver."
                  }
                ],
                "items": []
              }
            },
            {
              "type": "subsection",
              "text": "",
              "items": [],
              "definitions": [],
              "subsection": {
                "number": "14.6",
                "title": "Notices",
                "paragraphs": [
                  {
                    "text": "Notices to Conloca must be sent to [Legal Email]. Notices to Customer may be sent to the email associated with Customer’s account or delivered through the Services."
                  }
                ],
                "items": []
              }
            }
          ]
        }
      ]
    }
  }

export const TermsPageSectionsBlock: ComponentConfig<TermsPageSectionsBlockProps> =
  {
    label: "Terms page sections",
    fields: {
      hero: {
        type: "object",
        objectFields: {
          breadcrumbs: {
            type: "array",
            arrayFields: {
              text: { type: "text" },
            },
            getItemSummary: (item) => item.text,
          },
          effectiveDate: { type: "text" },
          effectiveDateLabel: { type: "text" },
          documentLabel: { type: "text" },
          documentName: { type: "text" },
          title: { type: "text" },
          description: { type: "textarea" },
        },
      },
      body: {
        type: "object",
        objectFields: {
          tocLabel: { type: "text" },
          intro: {
            type: "object",
            objectFields: {
              paragraphs: textListFields,
              details: termsDetailFields,
            },
          },
          sections: {
            type: "array",
            arrayFields: {
              id: { type: "text" },
              tocTitle: { type: "text" },
              title: { type: "text" },
              // Puck array items share one field set, so irrelevant payloads
              // for the chosen block type stay visible (and are ignored by
              // the mapper) — Puck cannot hide fields per item.
              blocks: {
                type: "array",
                arrayFields: {
                  type: {
                    type: "radio",
                    options: [
                      { label: "Paragraph", value: "paragraph" },
                      { label: "List", value: "list" },
                      { label: "Definitions", value: "definitions" },
                      { label: "Subsection", value: "subsection" },
                    ],
                  },
                  text: { type: "textarea" },
                  items: textListFields,
                  definitions: termsDetailFields,
                  subsection: {
                    type: "object",
                    objectFields: {
                      number: { type: "text" },
                      title: { type: "text" },
                      paragraphs: textListFields,
                      items: textListFields,
                    },
                  },
                },
                getItemSummary: (item) => item.type,
                // Puck's add-item flow uses defaultItemProps ?? {}; the mapper
                // switches on `type` and throws for undefined. Empty payloads
                // keep every type switchable without crashing.
                defaultItemProps: {
                  type: "paragraph",
                  text: "",
                  items: [],
                  definitions: [],
                  subsection: {
                    number: "",
                    title: "",
                    paragraphs: [],
                    items: [],
                  },
                },
              },
            },
            getItemSummary: (item) => item.title,
            // Puck's add-item flow uses defaultItemProps ?? {}; without this
            // the new section's `blocks` is undefined and the mapper crashes.
            defaultItemProps: { id: "", tocTitle: "", title: "", blocks: [] },
          },
        },
      },
    },
    defaultProps: termsPageSectionsDefaultProps,
    render: (props: TermsPageSectionsBlockProps) => (
      <TermsPageSections content={mapTermsPageSectionsProps(props)} />
    ),
  }
