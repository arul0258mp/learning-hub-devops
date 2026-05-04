// ============================================================
//  COURSES DATA — Static content for AWS, C, and Data Analysis
// ============================================================

const COURSES = {
  aws: {
    id: "aws",
    title: "AWS Cloud Fundamentals",
    emoji: "☁️",
    color: "#FF9900",
    gradient: "linear-gradient(135deg,#FF9900,#ff6600)",
    difficulty: "Beginner",
    duration: "8 hours",
    topics: 8,
    description: "Master Amazon Web Services — from core services to deployment best practices.",
    subtopics: [
      {
        id: "intro-cloud",
        title: "Introduction to Cloud Computing",
        preview: "What is cloud? Why does it matter?",
        readTime: "8 min",
        content: {
          intro: `Cloud computing is the delivery of computing services—including servers, storage, databases, networking, software, analytics, and intelligence—over the internet ("the cloud") to offer faster innovation, flexible resources, and economies of scale.

Instead of buying, owning, and maintaining physical data centers and servers, you can access technology services on an as-needed basis from a cloud provider like Amazon Web Services (AWS).`,
          sections: [
            {
              title: "Why Cloud Computing?",
              body: `Traditional on-premise infrastructure requires significant upfront investment in hardware, software licences, and IT staff. Cloud computing flips this model: you pay only for what you use, scale instantly, and rely on a global backbone of data centres maintained by experts.

Key advantages include **Trade capital expense for variable expense**, **massive economies of scale**, **stop guessing capacity**, **increase speed and agility**, and **go global in minutes** by deploying to any AWS Region with a few clicks.`
            },
            {
              title: "Cloud Deployment Models",
              body: `There are three primary deployment models:

**Public Cloud** — Resources owned and operated by a third-party provider (AWS, Azure, GCP). Shared infrastructure, highest elasticity, lowest upfront cost.

**Private Cloud** — Operated exclusively for a single organisation, either on-premises or hosted. Greater control but higher cost.

**Hybrid Cloud** — Combination of public and private clouds linked together. Best of both worlds for regulated industries.`
            }
          ],
          keyPoints: [
            "Cloud = delivering IT resources over the internet with pay-as-you-go pricing",
            "Three service models: IaaS, PaaS, SaaS",
            "Three deployment models: Public, Private, Hybrid",
            "AWS is the global market leader in cloud infrastructure",
            "Benefits: agility, elasticity, cost savings, global reach"
          ],
          suggestedQuestions: [
            "What is the difference between IaaS, PaaS, and SaaS?",
            "Why should I choose AWS over other cloud providers?",
            "What does pay-as-you-go mean in practice?"
          ],
          quiz: [
            {
              question: "What is the primary benefit of Cloud Computing's 'pay-as-you-go' model?",
              options: ["Unlimited free storage", "Trading capital expense for variable expense", "Physical ownership of servers", "No internet required"],
              answer: 1
            },
            {
              question: "Which cloud deployment model is operated exclusively for a single organization?",
              options: ["Public Cloud", "Hybrid Cloud", "Private Cloud", "Community Cloud"],
              answer: 2
            },
            {
              question: "What is a key advantage of Cloud Computing mentioned in the text?",
              options: ["Slower innovation", "Fixed resource allocation", "Go global in minutes", "Increased upfront costs"],
              answer: 2
            }
          ]
        }
      },
      {
        id: "ec2-basics",
        title: "EC2 — Elastic Compute Cloud",
        preview: "Virtual servers in the cloud",
        readTime: "10 min",
        content: {
          intro: `Amazon EC2 (Elastic Compute Cloud) provides scalable computing capacity in the AWS Cloud. You can use EC2 to launch as many or as few virtual servers as you need, configure security and networking, and manage storage — all in minutes.`,
          sections: [
            {
              title: "Instance Types",
              body: `EC2 offers a wide selection of instance types optimized to fit different use cases. Instance types comprise varying combinations of CPU, memory, storage, and networking capacity:

**General Purpose (t3, m6i)** — Balanced compute, memory, networking. Great for web servers and code repos.

**Compute Optimized (c6i)** — High performance processors. Ideal for batch processing, media transcoding, HPC.

**Memory Optimized (r6i, x2iezn)** — For workloads processing large data sets in memory (databases, real-time analytics).

**Storage Optimized (i3, d3)** — For workloads requiring high sequential read/write access to large datasets.`
            },
            {
              title: "Pricing Models",
              body: `**On-Demand** — Pay by the hour/second with no long-term commitments. Best for short, irregular workloads.

**Reserved Instances** — 1 or 3-year commitment in exchange for a significant discount (up to 72% vs On-Demand).

**Spot Instances** — Bid for unused EC2 capacity at up to 90% discount. Can be interrupted. Ideal for fault-tolerant workloads.

**Savings Plans** — Flexible pricing model offering savings of up to 66% over On-Demand.`
            }
          ],
          keyPoints: [
            "EC2 provides resizable compute capacity in the cloud",
            "Choose from 400+ instance types spanning 5 families",
            "Multiple pricing models: On-Demand, Reserved, Spot, Savings Plans",
            "Security groups act as virtual firewalls for your instances",
            "AMIs (Amazon Machine Images) define the OS and software stack"
          ],
          suggestedQuestions: [
            "How do I choose the right EC2 instance type?",
            "What are Spot Instances and when should I use them?",
            "How does EC2 security work?"
          ]
        }
      },
      {
        id: "s3-storage",
        title: "S3 — Simple Storage Service",
        preview: "Scalable object storage for any data",
        readTime: "9 min",
        content: {
          intro: `Amazon S3 is an object storage service offering industry-leading scalability, data availability, security, and performance. You can store and protect any amount of data for virtually any use case, such as data lakes, websites, mobile applications, backup and restore, archive, enterprise applications, IoT devices, and big data analytics.`,
          sections: [
            {
              title: "Core Concepts",
              body: `**Buckets** — Containers for objects. Bucket names are globally unique. You create buckets in a specific AWS Region.

**Objects** — The fundamental entities stored in S3. An object consists of the data itself plus metadata (key, version ID, value, metadata, sub-resources).

**Keys** — The unique identifier for an object within a bucket. Essentially the full path to the file.

**Versioning** — Preserve, retrieve, and restore every version of every object stored in a bucket.`
            },
            {
              title: "Storage Classes",
              body: `**S3 Standard** — High durability (11 9s), availability (99.99%), low latency, high throughput. Default choice.

**S3 Intelligent-Tiering** — Automatically moves data between tiers based on access patterns. Ideal for unknown or changing access patterns.

**S3 Standard-IA** — For infrequently accessed data but requires rapid access when needed. Lower cost-per-GB, retrieval fee applies.

**S3 Glacier** — Very low cost. Retrieval times from minutes to hours. For long-term archiving.

**S3 Glacier Deep Archive** — Lowest cost. Retrieval time 12–48 hours. For data accessed once or twice per year.`
            }
          ],
          keyPoints: [
            "S3 provides 11 nines (99.999999999%) of durability",
            "Objects can be up to 5 TB in size",
            "Multiple storage classes optimized for different access patterns",
            "Bucket policies and ACLs control access to your data",
            "S3 integrates with virtually every AWS service"
          ],
          suggestedQuestions: [
            "What is the difference between S3 storage classes?",
            "How do I make an S3 bucket public or private?",
            "Can S3 host a static website?"
          ]
        }
      },
      {
        id: "lambda",
        title: "AWS Lambda — Serverless Functions",
        preview: "Run code without managing servers",
        readTime: "10 min",
        content: {
          intro: `AWS Lambda lets you run code without provisioning or managing servers. You pay only for the compute time you consume. Lambda automatically scales your application by running code in response to each trigger.`,
          sections: [
            {
              title: "How Lambda Works",
              body: `Lambda functions are triggered by events. You upload your code (Python, Node.js, Java, Go, Ruby, etc.) and Lambda handles the infrastructure.

**Triggers** can be: API Gateway requests, S3 events (file uploads), DynamoDB streams, SNS/SQS messages, CloudWatch events (scheduled), and dozens more.

Lambda automatically scales from a few requests per day to thousands per second. Each function runs in its own isolated container with up to 10 GB of memory and 15 minutes execution time.`
            },
            {
              title: "Key Benefits",
              body: `**No servers to manage** — AWS runs and scales your infrastructure.

**Zero idle cost** — Pay only for requests and execution time. Free tier includes 1 million requests/month.

**Automatic scaling** — Lambda scales precisely with the size of the workload.

**Event-driven** — Connect to 200+ AWS services as event sources.

**Bring your own code** — Supports 12 programming language runtimes plus custom runtimes.`
            }
          ],
          keyPoints: [
            "Lambda is AWS's serverless compute service",
            "Maximum execution time: 15 minutes",
            "Memory: 128 MB to 10 GB",
            "Free tier: 1M requests and 400,000 GB-seconds/month",
            "Cold starts can cause latency — use Provisioned Concurrency for latency-sensitive apps"
          ],
          suggestedQuestions: [
            "What is a cold start in Lambda?",
            "How do I pass environment variables to a Lambda function?",
            "What's the difference between Lambda and EC2?"
          ]
        }
      },
      {
        id: "iam",
        title: "IAM — Identity & Access Management",
        preview: "Secure access to AWS resources",
        readTime: "8 min",
        content: {
          intro: `AWS IAM enables you to manage access to AWS services and resources securely. Using IAM, you can create and manage AWS users and groups, and use permissions to allow or deny their access to AWS resources.`,
          sections: [
            {
              title: "Core IAM Concepts",
              body: `**Users** — Individual people or applications that interact with AWS.

**Groups** — Collection of users. Permissions attached to a group apply to all users in that group.

**Roles** — AWS identities with permissions that can be assumed by users, services, or applications. Recommended over long-term credentials.

**Policies** — JSON documents that define permissions. Attached to users, groups, or roles.`
            },
            {
              title: "IAM Best Practices",
              body: `1. **Enable MFA** for all users, especially the root account.
2. **Use roles instead of access keys** for services running on AWS.
3. **Grant least privilege** — Never give more permissions than needed.
4. **Rotate credentials regularly**.
5. **Use AWS Organizations** to manage multi-account environments.`
            }
          ],
          keyPoints: [
            "IAM is global — not region-specific",
            "The root account should never be used for daily operations",
            "Policies are always evaluated as deny by default",
            "Cross-account access is achieved via IAM roles",
            "Access Analyzer helps identify unintended access"
          ],
          suggestedQuestions: [
            "What is the difference between an IAM user and a role?",
            "How do I apply the principle of least privilege in IAM?",
            "What is MFA and why is it important?"
          ]
        }
      },
      {
        id: "vpc",
        title: "VPC — Virtual Private Cloud",
        preview: "Your own isolated network on AWS",
        readTime: "11 min",
        content: {
          intro: `Amazon VPC lets you provision a logically isolated section of the AWS Cloud where you can launch AWS resources in a virtual network that you define. You have complete control over your virtual networking environment.`,
          sections: [
            {
              title: "VPC Building Blocks",
              body: `**Subnets** — Range of IP addresses in your VPC. Public subnets have a route to the internet; private subnets do not.

**Internet Gateway (IGW)** — Allows communication between your VPC and the internet.

**NAT Gateway** — Allows instances in private subnets to connect to the internet while preventing inbound internet traffic.

**Route Tables** — Set of rules (routes) that determine where network traffic from your subnet or gateway is directed.

**Security Groups** — Virtual firewalls that control inbound/outbound traffic for AWS resources.

**Network ACLs** — Stateless firewall at the subnet level.`
            },
            {
              title: "Public vs Private Subnets",
              body: `**Public Subnet** — Has a route to an Internet Gateway. Resources here (like web servers) can be reached from the internet.

**Private Subnet** — No direct internet route. Databases, application servers in private subnets are more secure. Use NAT Gateway for outbound internet access.

**Best practice**: Place your web tier in public subnets, your app and DB tiers in private subnets.`
            }
          ],
          keyPoints: [
            "Default VPC is created automatically in each AWS account per region",
            "CIDR blocks define the IP range of your VPC (e.g., 10.0.0.0/16)",
            "Security Groups are stateful; Network ACLs are stateless",
            "VPC Peering connects two VPCs privately",
            "VPC Flow Logs capture network traffic for monitoring and troubleshooting"
          ],
          suggestedQuestions: [
            "What is the difference between a security group and a NACL?",
            "How do I set up a 3-tier architecture in a VPC?",
            "What is CIDR notation?"
          ]
        }
      }
    ]
  },

  c: {
    id: "c",
    title: "C Programming Mastery",
    emoji: "💻",
    color: "#4eccf5",
    gradient: "linear-gradient(135deg,#1a6fff,#4eccf5)",
    difficulty: "Beginner",
    duration: "10 hours",
    topics: 7,
    description: "Learn C from scratch — memory management, pointers, data structures, and systems programming.",
    subtopics: [
      {
        id: "c-intro",
        title: "Introduction to C Programming",
        preview: "History, setup, and your first program",
        readTime: "7 min",
        content: {
          intro: `C is a general-purpose programming language that has influenced nearly every modern programming language. Created by Dennis Ritchie at Bell Labs in 1972, C remains one of the most widely used languages today — powering operating systems, embedded systems, and performance-critical applications.`,
          sections: [
            {
              title: "Why Learn C?",
              body: `C gives you **direct control over hardware and memory**, making it the language of choice for system programming, operating systems (Linux kernel is written in C), embedded firmware, compilers, and game engines.

Learning C builds a deep understanding of how computers actually work — memory layout, pointers, stack and heap — making you a stronger developer in any language.`
            },
            {
              title: "Your First C Program",
              body: `Every C program starts with the \`main\` function. Here's the classic Hello World:

\`\`\`c
#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}
\`\`\`

**Line 1**: \`#include <stdio.h>\` — Preprocessor directive that includes the Standard Input/Output header, giving us access to \`printf\`.

**Line 3**: \`int main()\` — Entry point. Every C program must have exactly one \`main\` function.

**Line 4**: \`printf()\` — Prints formatted text to standard output.

**Line 5**: \`return 0\` — Returns 0 to the OS, signaling successful execution.`
            }
          ],
          keyPoints: [
            "C was created in 1972 by Dennis Ritchie at Bell Laboratories",
            "C is compiled — source code → machine code via a compiler (GCC, Clang)",
            "C is case-sensitive: 'main' ≠ 'Main'",
            "Every C program must have a main() function",
            "Use gcc -o program program.c to compile"
          ],
          suggestedQuestions: [
            "What is the difference between C and C++?",
            "How do I install GCC on Windows?",
            "What does #include do in C?"
          ],
          quiz: [
            {
              question: "Who created the C programming language?",
              options: ["Bill Gates", "Dennis Ritchie", "James Gosling", "Bjarne Stroustrup"],
              answer: 1
            },
            {
              question: "Every C program must have exactly one _____ function.",
              options: ["start()", "init()", "main()", "execute()"],
              answer: 2
            },
            {
              question: "What preprocessor directive is used to include the Standard Input/Output header?",
              options: ["#import <stdio.h>", "#include <stdio.h>", "#define stdio.h", "#using stdio.h"],
              answer: 1
            }
          ]
        }
      },
      {
        id: "data-types",
        title: "Data Types and Variables",
        preview: "int, float, char, and type sizes",
        readTime: "9 min",
        content: {
          intro: `In C, every variable must be declared with a specific data type before use. The type determines how much memory is allocated and how the data is interpreted. Understanding data types is fundamental to writing correct, efficient C code.`,
          sections: [
            {
              title: "Primitive Data Types",
              body: `**int** — Integer: 4 bytes, range ±2.1 billion. Used for whole numbers.
\`int age = 25;\`

**float** — Single-precision decimal: 4 bytes, ~7 significant digits.
\`float pi = 3.14159f;\`

**double** — Double-precision decimal: 8 bytes, ~15 significant digits.
\`double radius = 6.371e6;\`

**char** — Single character: 1 byte.
\`char grade = 'A';\`

**void** — Represents absence of type. Used for functions that return nothing.`
            },
            {
              title: "Type Modifiers",
              body: `Modifiers change the storage size or sign of basic types:

**signed** / **unsigned** — Unsigned types can't store negative values but double the positive range. \`unsigned int count = 0;\`

**short** — Smaller int: typically 2 bytes.

**long** — Larger int: typically 8 bytes on 64-bit systems.

**const** — Declares a variable whose value cannot be modified. Always initialize const variables: \`const double GRAVITY = 9.81;\``
            }
          ],
          keyPoints: [
            "Use sizeof() to check the exact byte size on your platform",
            "Integer overflow wraps around silently — be careful",
            "Always prefer double over float for precision-sensitive calculations",
            "char can store small integers (−128 to 127) — it's just a 1-byte int",
            "Use const for values that should never change"
          ],
          suggestedQuestions: [
            "What happens when an integer overflows in C?",
            "What is the difference between float and double?",
            "How do I print different data types with printf?"
          ]
        }
      },
      {
        id: "pointers",
        title: "Pointers and Memory",
        preview: "The most powerful feature of C",
        readTime: "12 min",
        content: {
          intro: `Pointers are variables that store memory addresses. They are one of the most powerful — and most misunderstood — features of C. Mastering pointers is essential for dynamic memory allocation, data structures, and systems programming.`,
          sections: [
            {
              title: "Understanding Pointers",
              body: `When you declare \`int x = 42;\`, the value 42 is stored at some memory address, say \`0x7fff1234\`. A pointer to x stores that address:

\`\`\`c
int x = 42;
int *ptr = &x;   // ptr holds the address of x

printf("%d\\n", x);    // prints: 42
printf("%p\\n", ptr);  // prints: 0x7fff1234 (address)
printf("%d\\n", *ptr); // prints: 42 (dereferencing)
\`\`\`

The \`&\` operator gives the address of a variable. The \`*\` operator dereferences a pointer (gets the value at that address).`
            },
            {
              title: "Dynamic Memory Allocation",
              body: `The functions \`malloc\`, \`calloc\`, \`realloc\`, and \`free\` (in \`<stdlib.h>\`) manage the heap:

\`\`\`c
// Allocate memory for 5 integers
int *arr = (int *)malloc(5 * sizeof(int));
if (arr == NULL) {
    // malloc failed — always check!
    return 1;
}
arr[0] = 10;
arr[1] = 20;
// ... use arr ...
free(arr); // Always free when done!
arr = NULL; // Prevent dangling pointer
\`\`\`

**Memory leaks** occur when you allocate memory but never \`free\` it. Use Valgrind to detect leaks.`
            }
          ],
          keyPoints: [
            "A pointer stores a memory address, not a value",
            "& (address-of) and * (dereference) are inverse operators",
            "Always check if malloc returns NULL before using the pointer",
            "Every malloc must have a matching free to avoid memory leaks",
            "NULL pointers should never be dereferenced — causes segfault"
          ],
          suggestedQuestions: [
            "What is a segmentation fault?",
            "What is the difference between malloc and calloc?",
            "What are pointer arithmetic rules in C?"
          ]
        }
      },
      {
        id: "functions",
        title: "Functions and Scope",
        preview: "Modular programming in C",
        readTime: "9 min",
        content: {
          intro: `Functions are the building blocks of C programs. They allow you to break a complex problem into manageable pieces, promote code reuse, and improve readability. Understanding scope and the call stack is equally important.`,
          sections: [
            {
              title: "Defining and Calling Functions",
              body: `A C function must be declared before it is called (either via a prototype or full definition):

\`\`\`c
// Function prototype (declaration)
int add(int a, int b);

int main() {
    int result = add(3, 5);
    printf("Sum: %d\\n", result); // Sum: 8
    return 0;
}

// Function definition
int add(int a, int b) {
    return a + b;
}
\`\`\`

C is **pass-by-value** — functions receive copies of arguments. To modify a variable in the caller, pass a pointer.`
            },
            {
              title: "Variable Scope",
              body: `**Local variables** — Declared inside a function. Exist only while the function executes. Stored on the stack.

**Global variables** — Declared outside all functions. Accessible from any function in the file. Persist for the lifetime of the program.

**Static local variables** — Local in scope but retain their value between function calls.

\`\`\`c
void counter() {
    static int count = 0; // initialized once
    count++;
    printf("Called %d times\\n", count);
}
\`\`\``
            }
          ],
          keyPoints: [
            "C always passes arguments by value — use pointers to pass by reference",
            "Prototypes must match the function definition's signature",
            "The call stack grows with each function call and shrinks on return",
            "Avoid deeply recursive functions — risk of stack overflow",
            "static local variables persist between calls"
          ],
          suggestedQuestions: [
            "What is the difference between pass-by-value and pass-by-reference in C?",
            "How do I return multiple values from a C function?",
            "What is recursion? Show me an example."
          ]
        }
      },
      {
        id: "arrays-strings",
        title: "Arrays and Strings",
        preview: "Collections and text in C",
        readTime: "10 min",
        content: {
          intro: `Arrays store multiple values of the same type in contiguous memory. Strings in C are arrays of characters terminated by a null character (\0). Understanding arrays and strings is essential for almost every C program.`,
          sections: [
            {
              title: "Arrays",
              body: `\`\`\`c
int scores[5] = {95, 87, 78, 92, 88};
// Access: scores[0] = 95, scores[4] = 88
// Array name = pointer to first element
printf("%p\\n", scores); // same as &scores[0]
\`\`\`

2D arrays:
\`\`\`c
int matrix[3][3] = {
    {1, 2, 3},
    {4, 5, 6},
    {7, 8, 9}
};
printf("%d\\n", matrix[1][2]); // 6
\`\`\``
            },
            {
              title: "Strings in C",
              body: `Strings are char arrays ending with '\\0' (null terminator):

\`\`\`c
char name[] = "Alice"; // stored as: {'A','l','i','c','e','\\0'}
char buf[50];

// Key string functions (string.h)
strlen(name);           // length (without \\0): 5
strcpy(buf, name);      // copy name → buf
strcat(buf, " Smith");  // concatenate
strcmp(name, "Alice");  // 0 if equal
\`\`\`

⚠️ Never use \`strcpy\` without ensuring the destination is large enough — use \`strncpy\` for safety.`
            }
          ],
          keyPoints: [
            "Array indices are 0-based in C",
            "Array name is a constant pointer to the first element",
            "C strings are null-terminated — always allocate strlen + 1 bytes",
            "out-of-bounds array access is undefined behavior — no safety checks!",
            "Use string.h functions: strlen, strcpy, strcat, strcmp, strstr"
          ],
          suggestedQuestions: [
            "What is a buffer overflow in C?",
            "How do I reverse a string in C?",
            "What is the difference between char[] and char*?"
          ]
        }
      }
    ]
  },

  eda: {
    id: "eda",
    title: "Data Analysis & EDA",
    emoji: "📊",
    color: "#a855f7",
    gradient: "linear-gradient(135deg,#6366f1,#a855f7)",
    difficulty: "Intermediate",
    duration: "9 hours",
    topics: 6,
    description: "Master Exploratory Data Analysis — statistics, visualization, and insights extraction with Python.",
    subtopics: [
      {
        id: "eda-intro",
        title: "What is EDA?",
        preview: "The art of exploring data",
        readTime: "7 min",
        content: {
          intro: `Exploratory Data Analysis (EDA) is an approach to analyzing data sets to summarize their main characteristics, often using statistical graphics and other data visualization methods. EDA helps you understand your data before applying machine learning models or drawing conclusions.`,
          sections: [
            {
              title: "The EDA Process",
              body: `EDA follows a general workflow:

1. **Load & Inspect** — Read the dataset, check shape, dtypes, and first few rows.
2. **Understand Variables** — Identify target variable, features, continuous vs categorical.
3. **Univariate Analysis** — Analyze each variable in isolation (distributions, outliers).
4. **Bivariate Analysis** — Relationships between pairs of variables (correlations, scatter plots).
5. **Multivariate Analysis** — Complex relationships among 3+ variables.
6. **Handle Missing Data** — Identify nulls and decide strategy (drop, impute).
7. **Outlier Detection** — Identify and handle extreme values.
8. **Feature Engineering** — Create new features from existing ones.`
            },
            {
              title: "Essential Python Tools",
              body: `**Pandas** — DataFrame operations: loading, cleaning, aggregating, transforming tabular data.

**NumPy** — Fast numerical operations on arrays. Foundation of data science in Python.

**Matplotlib** — Low-level plotting library. Full control over every plot element.

**Seaborn** — Statistical visualization built on Matplotlib. Beautiful defaults, fewer lines of code.

**Plotly** — Interactive visualizations. Hover, zoom, pan. Great for dashboards.`
            }
          ],
          keyPoints: [
            "EDA is not a formal procedure — it's a mindset of curiosity and exploration",
            "Always start by understanding the business context of your data",
            "Shape, dtypes, and .describe() are your first 3 commands",
            "Visualizations reveal patterns that statistics alone miss",
            "EDA should guide but not over-fit your modeling decisions"
          ],
          suggestedQuestions: [
            "What is the difference between EDA and data preprocessing?",
            "What are the most common Python libraries for data analysis?",
            "How do I start an EDA on a new dataset?"
          ],
          quiz: [
            {
              question: "What does EDA stand for in Data Analysis?",
              options: ["Electronic Data Access", "Exploratory Data Analysis", "Efficient Data Aggregation", "Extended Data Archiving"],
              answer: 1
            },
            {
              question: "Which Python library is primarily used for DataFrame operations like loading and cleaning data?",
              options: ["NumPy", "Matplotlib", "Seaborn", "Pandas"],
              answer: 3
            },
            {
              question: "What is the primary goal of EDA?",
              options: ["To deploy machine learning models", "To summarize data characteristics using visual methods", "To encrypt sensitive data", "To increase database storage"],
              answer: 1
            }
          ]
        }
      },
      {
        id: "descriptive-stats",
        title: "Descriptive Statistics",
        preview: "Mean, median, std, and distributions",
        readTime: "10 min",
        content: {
          intro: `Descriptive statistics summarize and describe the basic features of a dataset. They provide simple summaries about the sample and the measures, forming the basis of virtually every quantitative analysis.`,
          sections: [
            {
              title: "Measures of Central Tendency",
              body: `**Mean (Average)** — Sum of all values divided by count. Sensitive to outliers.
\`df['salary'].mean()\`

**Median** — Middle value when sorted. Robust to outliers. Use for skewed data.
\`df['salary'].median()\`

**Mode** — Most frequent value. Useful for categorical data.
\`df['city'].mode()[0]\`

**When to use which?** For normally distributed data, mean ≈ median ≈ mode. When data is skewed (e.g., income), median is more representative.`
            },
            {
              title: "Measures of Spread",
              body: `**Variance** — Average squared deviation from the mean. Higher variance = more spread.

**Standard Deviation (σ)** — Square root of variance. Same units as original data.
\`df['age'].std()\`

**IQR (Interquartile Range)** — Q3 − Q1. Middle 50% of data. Key for outlier detection: values beyond Q1 − 1.5×IQR or Q3 + 1.5×IQR are outliers.

**Range** — max − min. Simple but highly sensitive to outliers.

\`\`\`python
# Comprehensive snapshot
df.describe()  # count, mean, std, min, 25%, 50%, 75%, max
\`\`\``
            }
          ],
          keyPoints: [
            "Use .describe() as your first statistical overview",
            "Mean is affected by outliers; median is more robust",
            "Normal distribution: 68% of data within 1σ, 95% within 2σ, 99.7% within 3σ",
            "Skewness > 0 = right-skewed; < 0 = left-skewed",
            "Kurtosis measures tail heaviness — high kurtosis = more outliers"
          ],
          suggestedQuestions: [
            "What is the difference between variance and standard deviation?",
            "How do I detect outliers using the IQR method?",
            "What does a skewed distribution mean for my analysis?"
          ]
        }
      },
      {
        id: "data-visualization",
        title: "Data Visualization",
        preview: "Charts, plots, and visual insights",
        readTime: "11 min",
        content: {
          intro: `Data visualization is the graphical representation of information and data. By using visual elements like charts, graphs, and maps, data visualization tools provide an accessible way to see and understand trends, outliers, and patterns in data.`,
          sections: [
            {
              title: "Choosing the Right Chart",
              body: `**Histogram** — Distribution of a single continuous variable. Look for shape, skewness, outliers.
\`\`\`python
import seaborn as sns
sns.histplot(df['age'], bins=30, kde=True)
\`\`\`

**Box Plot** — Five-number summary + outliers. Compare distributions across groups.
\`\`\`python
sns.boxplot(x='category', y='value', data=df)
\`\`\`

**Scatter Plot** — Relationship between two continuous variables. Reveals correlation.
\`\`\`python
sns.scatterplot(x='income', y='spending', data=df, hue='gender')
\`\`\`

**Bar Chart** — Compare counts or values across categories.
\`\`\`python
df['city'].value_counts().plot(kind='bar')
\`\`\``
            },
            {
              title: "Correlation Analysis",
              body: `**Correlation coefficient (r)** measures linear relationship strength: −1 (perfect negative) to +1 (perfect positive). 0 = no linear relationship.

\`\`\`python
# Correlation matrix
corr = df.select_dtypes('number').corr()

# Heatmap visualization
import seaborn as sns
import matplotlib.pyplot as plt

plt.figure(figsize=(10,8))
sns.heatmap(corr, annot=True, fmt='.2f', cmap='coolwarm', center=0)
plt.title('Correlation Matrix')
plt.show()
\`\`\`

⚠️ **Correlation ≠ Causation**. Two variables can be correlated purely by chance or due to a confounding variable.`
            }
          ],
          keyPoints: [
            "Choose chart type based on data type and question (distribution, comparison, relationship)",
            "Always label axes, add titles, and include units",
            "Seaborn's pairplot() shows all bivariate relationships at once",
            "Color encodes a third variable — use it wisely",
            "Interactive plots (Plotly) are better for exploration; static for reports"
          ],
          suggestedQuestions: [
            "How do I create a heatmap in Python?",
            "When should I use a box plot vs a violin plot?",
            "How do I interpret a correlation coefficient?"
          ]
        }
      },
      {
        id: "missing-data",
        title: "Handling Missing Data",
        preview: "Identify, analyze, and fix null values",
        readTime: "9 min",
        content: {
          intro: `Missing data is one of the most common and challenging problems in data analysis. How you handle missing values can significantly impact the quality of your analysis and the performance of any machine learning models you build downstream.`,
          sections: [
            {
              title: "Types of Missing Data",
              body: `**MCAR (Missing Completely At Random)** — Missingness is unrelated to any data. Safe to drop. E.g., sensor malfunction.

**MAR (Missing At Random)** — Missingness is related to observed data but not to the missing value itself. E.g., females less likely to report income.

**MNAR (Missing Not At Random)** — Missingness is related to the unobserved value. Most problematic. E.g., sicker patients less likely to complete surveys.`
            },
            {
              title: "Strategies for Handling Nulls",
              body: `\`\`\`python
# Detect missing values
df.isnull().sum()
df.isnull().mean() * 100  # percentage missing

# Drop rows/columns
df.dropna()                        # drop rows with any null
df.dropna(subset=['target'])       # drop only if target is null
df.dropna(thresh=len(df)*0.5, axis=1) # drop cols >50% missing

# Imputation
df['age'].fillna(df['age'].median(), inplace=True)  # median fill
df['city'].fillna(df['city'].mode()[0], inplace=True)  # mode fill

# Advanced: sklearn SimpleImputer
from sklearn.impute import SimpleImputer
imp = SimpleImputer(strategy='mean')
df[['age']] = imp.fit_transform(df[['age']])
\`\`\``
            }
          ],
          keyPoints: [
            "Always analyze WHY data is missing before deciding how to handle it",
            "Dropping is safe only if >5% of rows are affected and data is MCAR",
            "Use median imputation for skewed numeric data",
            "Use mode imputation for categorical data",
            "Flag imputed values with a binary indicator column"
          ],
          suggestedQuestions: [
            "Should I drop rows or impute missing values?",
            "What is the difference between MCAR, MAR, and MNAR?",
            "How do I visualize missing data patterns?"
          ]
        }
      },
      {
        id: "outlier-detection",
        title: "Outlier Detection & Treatment",
        preview: "Spot and handle extreme values",
        readTime: "9 min",
        content: {
          intro: `Outliers are data points that differ significantly from other observations. They can arise from measurement errors, data entry errors, or genuine extreme values. Correctly identifying and treating outliers is critical for accurate analysis and robust models.`,
          sections: [
            {
              title: "Detection Methods",
              body: `**Z-Score Method** — Values more than 3 standard deviations from the mean:
\`\`\`python
from scipy import stats
z_scores = stats.zscore(df['value'])
outliers = df[(abs(z_scores) > 3)]
\`\`\`

**IQR Method** (more robust for skewed data):
\`\`\`python
Q1 = df['value'].quantile(0.25)
Q3 = df['value'].quantile(0.75)
IQR = Q3 - Q1
outliers = df[(df['value'] < Q1 - 1.5*IQR) | 
              (df['value'] > Q3 + 1.5*IQR)]
\`\`\`

**Box Plot** — Visual outlier detection. Points beyond the whiskers are potential outliers.`
            },
            {
              title: "Treatment Options",
              body: `1. **Remove** — If caused by clear data errors and few in number.
2. **Cap (Winsorize)** — Replace with boundary values (e.g., 1st and 99th percentile).
3. **Transform** — Log or square root transformation compresses extreme values.
4. **Separate analysis** — Create an indicator variable and analyze with/without outliers.
5. **Keep** — If genuine extreme values, robust algorithms (tree-based) handle them well.

Never blindly remove outliers — they may represent the most interesting data points!`
            }
          ],
          keyPoints: [
            "Box plots are the fastest visual way to spot outliers",
            "IQR method is more robust to skewed distributions than Z-score",
            "Business context determines if an outlier is an error or a signal",
            "Machine learning tree-based models (Random Forest, XGBoost) are outlier-resistant",
            "Document all outlier decisions in your analysis report"
          ],
          suggestedQuestions: [
            "What is the IQR method for outlier detection?",
            "Should I always remove outliers before building a model?",
            "How do I visualize outliers with a box plot?"
          ]
        }
      }
    ]
  }
};

// Export for use in other scripts
if (typeof module !== 'undefined') module.exports = COURSES;
