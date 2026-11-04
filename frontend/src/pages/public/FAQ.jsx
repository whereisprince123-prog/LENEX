import { useState } from "react";
import { Link } from "react-router-dom";

function FAQ() {
    const [openIndex, setOpenIndex] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    const faqs = [
        {
            category: "General Questions",
            questions: [
                {
                    question: "What is LENEX?",
                    answer:
                        "LENEX is a debt management system designed to help businesses record, track, and manage customer debts. It helps business owners remember who owes them money, how much they owe, and when the debt is due."
                },
                {
                    question: "Who is LENEX designed for?",
                    answer:
                        "LENEX is designed for small and medium-sized businesses, shops, wholesalers, retailers, and other businesses that allow customers to buy goods or services on credit."
                },
                {
                    question: "Can I use LENEX on my phone?",
                    answer:
                        "Yes. LENEX is designed to work on phones, tablets, laptops, and desktop computers. You can manage your debts from any supported web browser."
                },
                {
                    question: "Do I need special accounting knowledge to use LENEX?",
                    answer:
                        "No. LENEX is designed to be simple and easy to understand. You can record a debt, track it, and mark it as paid without needing advanced accounting knowledge."
                }
            ]
        },

        {
            category: "Debt Management",
            questions: [
                {
                    question: "How does LENEX work?",
                    answer:
                        "The process is simple: record the customer, record the debt, track the debt until the customer pays, and then mark the debt as paid when you receive the cash."
                },
                {
                    question: "What information do I need to record a customer?",
                    answer:
                        "You can record the customer's full name, phone number, home address, and optional notes."
                },
                {
                    question: "What information do I need to record a debt?",
                    answer:
                        "A debt includes the customer, amount owed, description, debt date, due date, status, and optional notes."
                },
                {
                    question: "Can I see all the money my customers owe me?",
                    answer:
                        "Yes. LENEX provides a clear view of your unpaid debts so you can easily see how much customers currently owe your business."
                },
                {
                    question: "What is an overdue debt?",
                    answer:
                        "An overdue debt is a debt that has passed its due date and has not yet been marked as paid."
                },
                {
                    question: "Can I see only overdue debts?",
                    answer:
                        "Yes. LENEX provides an overdue section where you can quickly see debts that have passed their due dates."
                },
                {
                    question: "What happens when a customer pays?",
                    answer:
                        "When you receive the cash directly from the customer, you open the debt in LENEX and click 'Mark as Paid'. LENEX then records the debt as paid together with the payment date and the business user who marked it as paid."
                },
                {
                    question: "Can I cancel a debt?",
                    answer:
                        "Yes. A debt can be cancelled when it should no longer be considered an active debt, depending on the permissions available to your business account."
                }
            ]
        },

        {
            category: "Payments",
            questions: [
                {
                    question: "Does LENEX process payments?",
                    answer:
                        "No. LENEX does not process, hold, transfer, or collect money. Customers pay the business directly, usually in cash or through whatever payment method the business accepts."
                },
                {
                    question: "How do I mark a debt as paid?",
                    answer:
                        "After receiving the customer's payment directly, open the debt in LENEX and select 'Mark as Paid'. LENEX records the debt as paid."
                },
                {
                    question: "Does LENEX support partial payments?",
                    answer:
                        "The current LENEX version is focused on recording and tracking debts and marking them as paid. Partial-payment management can be introduced as a future feature."
                },
                {
                    question: "Does LENEX replace my accounting software?",
                    answer:
                        "No. LENEX is focused specifically on customer credit and debt management. It can complement accounting or business management software rather than replacing a complete accounting system."
                }
            ]
        },

        {
            category: "SMS Notifications",
            questions: [
                {
                    question: "Will the customer receive an SMS when a debt is paid?",
                    answer:
                        "Yes. After a business user marks a debt as paid, LENEX can send an SMS confirmation to the customer's registered phone number."
                },
                {
                    question: "What will the payment confirmation SMS contain?",
                    answer:
                        "The confirmation can include the customer's name, amount of the debt, business name, payment status, payment date, and a thank-you message."
                },
                {
                    question: "What happens if the SMS fails to send?",
                    answer:
                        "The debt remains marked as paid because the business has already confirmed that it received the customer's payment. LENEX can record the SMS notification as failed so it can be handled separately."
                },
                {
                    question: "Does the customer need a LENEX account to receive an SMS?",
                    answer:
                        "No. Customers do not need to create a LENEX account in order to receive a debt or payment confirmation SMS."
                }
            ]
        },

        {
            category: "Account & Security",
            questions: [
                {
                    question: "Can multiple employees use one business account?",
                    answer:
                        "Yes. A business can have multiple authorized users such as owners, managers, and employees. Their access can be managed according to their assigned role."
                },
                {
                    question: "Can one business see another business's customers?",
                    answer:
                        "No. Business data is separated. A business user can only access customers and debts belonging to their own business."
                },
                {
                    question: "Who manages the LENEX platform?",
                    answer:
                        "LENEX has a separate administration area for platform administrators. LENEX administrators manage the overall platform, while business users manage only their own business data."
                },
                {
                    question: "Is my business information secure?",
                    answer:
                        "LENEX is designed with separate business accounts and authenticated access so that business users can only access information belonging to their authorized business."
                },
                {
                    question: "Can I use LENEX for a small shop?",
                    answer:
                        "Yes. LENEX is suitable for small shops and businesses that regularly allow customers to buy goods or services on credit."
                }
            ]
        }
    ];

    const toggleFAQ = (categoryIndex, questionIndex) => {
        const index = `${categoryIndex}-${questionIndex}`;

        setOpenIndex((currentIndex) =>
            currentIndex === index ? null : index
        );
    };

    const filteredCategories = faqs
        .map((category) => ({
            ...category,
            questions: category.questions.filter((item) =>
                `${item.question} ${item.answer}`
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
            )
        }))
        .filter((category) => category.questions.length > 0);

    return (
        <div className="min-h-screen bg-white text-gray-900">

            {/* Navbar */}
            <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur-md">
                <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

                    <Link
                        to="/"
                        className="flex items-center gap-3"
                    >
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-600">
                            <span className="text-lg font-bold text-white">
                                L
                            </span>
                        </div>

                        <div>
                            <h1 className="text-lg font-bold tracking-tight text-gray-950">
                                LENEX
                            </h1>

                            <p className="text-[10px] font-medium text-gray-400">
                                Debt Management
                            </p>
                        </div>
                    </Link>

                    <Link
                        to="/"
                        className="text-sm font-semibold text-gray-600 transition hover:text-sky-600"
                    >
                        ← Back to Home
                    </Link>
                </div>
            </header>


            {/* Hero */}
            <section className="relative overflow-hidden bg-slate-50">
                <div className="absolute -left-24 top-10 h-64 w-64 rounded-full bg-sky-100 blur-3xl" />
                <div className="absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-blue-100 blur-3xl" />

                <div className="relative mx-auto max-w-4xl px-6 py-20 text-center sm:py-24">

                    <span className="inline-flex rounded-full bg-sky-100 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-sky-700">
                        Help Center
                    </span>

                    <h2 className="mt-6 text-4xl font-bold tracking-tight text-gray-950 sm:text-5xl">
                        Frequently Asked
                        <span className="block text-sky-600">
                            Questions
                        </span>
                    </h2>

                    <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-gray-500 sm:text-lg">
                        Find answers to common questions about LENEX,
                        debt management, payments, SMS notifications,
                        and your business account.
                    </p>


                    {/* Search */}
                    <div className="mx-auto mt-10 max-w-2xl">
                        <div className="relative">

                            <span className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-xl text-gray-400">
                                ⌕
                            </span>

                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) =>
                                    setSearchTerm(e.target.value)
                                }
                                placeholder="Search your question..."
                                className="h-14 w-full rounded-2xl border border-gray-200 bg-white pl-14 pr-5 text-sm text-gray-800 shadow-sm outline-none transition placeholder:text-gray-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                            />

                        </div>
                    </div>

                </div>
            </section>


            {/* FAQ Content */}
            <main className="mx-auto max-w-4xl px-6 py-16 sm:py-20">

                {filteredCategories.length > 0 ? (

                    <div className="space-y-14">

                        {filteredCategories.map(
                            (category, categoryIndex) => (

                                <section
                                    key={category.category}
                                >

                                    <div className="mb-6">
                                        <p className="text-xs font-bold uppercase tracking-widest text-sky-600">
                                            LENEX Help
                                        </p>

                                        <h3 className="mt-2 text-2xl font-bold tracking-tight text-gray-950">
                                            {category.category}
                                        </h3>
                                    </div>


                                    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">

                                        {category.questions.map(
                                            (item, questionIndex) => {

                                                const index = `${categoryIndex}-${questionIndex}`;

                                                const isOpen =
                                                    openIndex === index;

                                                return (
                                                    <div
                                                        key={item.question}
                                                        className="border-b border-gray-100 last:border-b-0"
                                                    >

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                toggleFAQ(
                                                                    categoryIndex,
                                                                    questionIndex
                                                                )
                                                            }
                                                            className="flex w-full items-center justify-between gap-6 px-5 py-5 text-left transition hover:bg-slate-50 sm:px-6"
                                                        >

                                                            <span
                                                                className={`text-sm font-semibold sm:text-base ${
                                                                    isOpen
                                                                        ? "text-sky-600"
                                                                        : "text-gray-800"
                                                                }`}
                                                            >
                                                                {item.question}
                                                            </span>

                                                            <span
                                                                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition ${
                                                                    isOpen
                                                                        ? "bg-sky-100 text-sky-600"
                                                                        : "bg-gray-100 text-gray-500"
                                                                }`}
                                                            >
                                                                <span
                                                                    className={`text-xl leading-none transition-transform ${
                                                                        isOpen
                                                                            ? "rotate-45"
                                                                            : ""
                                                                    }`}
                                                                >
                                                                    +
                                                                </span>
                                                            </span>

                                                        </button>


                                                        {isOpen && (
                                                            <div className="px-5 pb-6 sm:px-6">

                                                                <div className="border-l-2 border-sky-200 pl-4">
                                                                    <p className="text-sm leading-7 text-gray-500">
                                                                        {item.answer}
                                                                    </p>
                                                                </div>

                                                            </div>
                                                        )}

                                                    </div>
                                                );
                                            }
                                        )}

                                    </div>

                                </section>
                            )
                        )}

                    </div>

                ) : (

                    /* No Results */
                    <div className="rounded-2xl border border-gray-200 bg-slate-50 px-6 py-16 text-center">

                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-2xl">
                            ?
                        </div>

                        <h3 className="mt-5 text-xl font-bold text-gray-900">
                            No questions found
                        </h3>

                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                            We couldn't find an answer matching
                            your search. Try using different keywords.
                        </p>

                        <button
                            type="button"
                            onClick={() => setSearchTerm("")}
                            className="mt-6 rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700"
                        >
                            View all questions
                        </button>

                    </div>

                )}

            </main>


            {/* Still Have Questions */}
            <section className="border-t border-gray-100 bg-slate-50">

                <div className="mx-auto max-w-4xl px-6 py-16 text-center sm:py-20">

                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-100">
                        <span className="text-2xl text-sky-600">
                            ?
                        </span>
                    </div>

                    <h2 className="mt-5 text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
                        Still have questions?
                    </h2>

                    <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-gray-500">
                        If you cannot find the answer you are looking
                        for, you can get in touch with the LENEX team.
                    </p>

                    <Link
                        to="/#contact"
                        className="mt-7 inline-flex items-center rounded-xl bg-sky-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 hover:shadow-lg hover:shadow-sky-100"
                    >
                        Contact LENEX
                        <span className="ml-2 text-lg">
                            →
                        </span>
                    </Link>

                </div>

            </section>


            {/* Footer */}
            <footer className="bg-slate-950">

                <div className="mx-auto max-w-7xl px-6 py-10">

                    <div className="flex flex-col items-center justify-between gap-5 text-center sm:flex-row sm:text-left">

                        <Link
                            to="/"
                            className="flex items-center gap-3"
                        >
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-600">
                                <span className="font-bold text-white">
                                    L
                                </span>
                            </div>

                            <div>
                                <p className="font-bold text-white">
                                    LENEX
                                </p>

                                <p className="text-[10px] text-slate-500">
                                    Smarter credit, Better business
                                </p>
                            </div>
                        </Link>

                        <p className="text-xs text-slate-500">
                            © {new Date().getFullYear()} LENEX.
                            All rights reserved.
                        </p>

                    </div>

                </div>

            </footer>

        </div>
    );
}

export default FAQ;