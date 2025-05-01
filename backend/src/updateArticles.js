import prisma from './prismaClient.js';

const articles = [
  {
    id: 1,
    title: "Blockchain Technology Revolutionizing Journalism Verification",
    content: `In an era of rampant misinformation, blockchain technology offers a promising solution for verifying journalistic content. By leveraging distributed ledger technology, specifically Polygon's Proof of Stake (PoS) chain, news organizations can now create immutable records of their reporting process.

The verification challenge in modern journalism stems from the ease with which digital content can be manipulated. Traditional fact-checking methods, while valuable, often lack transparency and can be influenced by institutional biases. Blockchain addresses these concerns by creating a permanent, tamper-proof record of journalistic work.

When an article is published on a blockchain-based platform like factoura, each step of the reporting process—from initial source interviews to document verification—can be cryptographically secured. This creates an auditable trail that readers can independently verify.

The implications extend beyond simple verification. With blockchain, journalists can prove their reporting occurred at specific times, protecting against claims that stories were fabricated after events transpired. Sources can verify their contributions without revealing their identities, crucial for whistleblowers in sensitive investigations.

Several pioneering news organizations have already implemented blockchain verification systems. The results show increased reader trust and engagement, particularly among demographics traditionally skeptical of mainstream media reporting.

Critics argue that blockchain implementation adds unnecessary technical complexity to journalism. However, user-friendly interfaces can abstract this complexity while maintaining the integrity benefits. The energy consumption concerns of early blockchain systems have largely been addressed by modern PoS chains like Polygon.

As digital journalism continues evolving, blockchain verification represents not just a technical innovation but a fundamental shift in how journalistic truth is established and maintained in the digital age.`
  },
  {
    id: 2,
    title: "Collaborative Journalism: The Future of Investigative Reporting",
    content: `The landscape of investigative journalism is undergoing a profound transformation through collaborative methodologies. Traditional models, where lone reporters or small teams tackle complex stories, are giving way to networked approaches involving dozens or even hundreds of contributors across multiple organizations.

This shift began with landmark collaborative investigations like the Panama Papers, where over 100 media organizations worked together to process 11.5 million leaked documents. The success of this approach demonstrated that collaboration could achieve results beyond the capacity of any single newsroom.

Today's collaborative journalism extends beyond professional newsrooms to include citizen journalists, academic researchers, and specialized experts. This democratized approach brings diverse perspectives and specialized knowledge to investigations that might otherwise remain superficial.

Digital platforms designed specifically for collaborative journalism facilitate this work by providing secure communication channels, document sharing capabilities, and verification tools. These platforms allow contributors to work asynchronously across time zones while maintaining editorial standards.

The benefits extend beyond just pooling resources. When multiple organizations publish findings simultaneously, it becomes significantly more difficult for powerful interests to suppress stories through legal threats or access restrictions. This safety-in-numbers approach has proven effective for investigations into government corruption and corporate malfeasance.

Challenges remain, particularly around credit attribution, revenue sharing, and maintaining consistent editorial standards across diverse contributors. However, emerging blockchain-based platforms offer potential solutions by creating transparent records of contributions while protecting contributor privacy when necessary.

For journalism educators, preparing students for this collaborative future requires teaching new skills beyond traditional reporting. These include digital collaboration tools, data verification methods, and cross-cultural communication strategies essential for global investigations.`
  },
  {
    id: 3,
    title: "Source Protection in the Digital Age: New Approaches for Journalists",
    content: `Protecting confidential sources has always been a cornerstone of investigative journalism, but digital surveillance has created unprecedented challenges for this essential practice. Traditional methods like in-person meetings and burner phones provide insufficient protection against sophisticated monitoring capabilities available to both state and non-state actors.

Modern source protection requires a multi-layered approach combining technical safeguards with procedural discipline. Encrypted communication platforms like Signal provide end-to-end encryption, but journalists must understand their limitations. Metadata—information about when and with whom communication occurs—often remains vulnerable even when message content is protected.

Secure drop systems, pioneered by organizations like WikiLeaks and now adopted by many major news outlets, allow sources to submit information anonymously. These systems typically operate on isolated computers disconnected from organizational networks, accessed through anonymizing browsers like Tor.

Beyond technical solutions, procedural security remains crucial. This includes compartmentalizing information, minimizing digital footprints when meeting sources, and implementing strict data minimization practices to reduce what could be compromised in a breach.

Legal protections for journalists and their sources vary dramatically across jurisdictions, creating a complex landscape for international reporting. While some countries have strong shield laws protecting journalists from being forced to reveal sources, these protections often have national security exceptions that can be broadly interpreted.

Blockchain-based platforms offer promising new approaches for source protection. By using zero-knowledge proofs, these systems can verify that information came from a legitimate source without revealing the source's identity, even to the journalists themselves in some implementations.

As surveillance capabilities continue advancing, journalism organizations must invest in ongoing security training and regularly updated protection protocols. The most effective approach combines technical tools, procedural discipline, legal knowledge, and organizational support systems for both journalists and their vulnerable sources.`
  }
];

async function updateArticles() {
  try {
    for (const article of articles) {
      await prisma.article.update({
        where: { id: article.id },
        data: {
          title: article.title,
          content: article.content
        }
      });
      console.log(`Updated article ID ${article.id}: "${article.title}"`);
    }
    console.log('All articles have been updated successfully.');
  } catch (error) {
    console.error('Error updating articles:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateArticles();
