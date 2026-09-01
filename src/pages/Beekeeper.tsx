import { useState, useRef, useEffect } from 'react';
import { Link } from '@/components/Link';
<<<<<<< HEAD
import { Logo } from '@/components/ui';
import { useStore } from '@/lib/store';
import { extractFromMessage } from '@/lib/aiExtract';
import type { ChatMessage, ExtractedInfo, Harvest } from '@/lib/types';
import {
  Mic,
  Send,
  ArrowLeft,
  Cpu,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

type Intent = 'harvest' | 'inspection' | 'issue' | null;

type Stage =
  | 'idle'
  | 'awaiting_hive'
  | 'awaiting_quantity'
  | 'awaiting_inspection'
  | 'awaiting_issue'
  | 'confirming'
  | 'verified'
  | 'rejected';

export function Beekeeper() {
  const { hives, harvests, addHarvest, appendBlock } = useStore();

  const beekeeperId = 'BK-001';

  const beekeeperHives = hives.filter(
    (h) => h.beekeeperId === beekeeperId
  );
=======
import { Logo, StatusBadge, Card, Check, XMark } from '@/components/ui';
import { useStore } from '@/lib/store';
import { extractFromMessage } from '@/lib/aiExtract';
import type { ChatMessage, ExtractedInfo, Harvest, VerificationLevel } from '@/lib/types';
import { Mic, Send, ArrowLeft, ShieldCheck, Trees, Cpu, AlertTriangle, CheckCircle2 } from 'lucide-react';

type Stage = 'idle' | 'awaiting_hive' | 'awaiting_quantity' | 'confirming' | 'verified' | 'rejected';

export function Beekeeper() {
  const { hives, harvests, addHarvest, appendBlock } = useStore();
  const beekeeperHives = hives.filter((h) => h.beekeeperId === 'BK-001');
>>>>>>> 55c13742b2b40ab37ad8e0da10183586db2d41d6

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm0',
      sender: 'assistant',
      text: 'Namaste Ramesh! What would you like to record?',
      kind: 'quick-reply',
<<<<<<< HEAD
      quickReplies: [
        'Record Inspection',
        'Record Harvest',
        'Report Hive Issue',
      ],
    },
  ]);

  const [input, setInput] = useState('');
  const [stage, setStage] = useState<Stage>('idle');

  const [intent, setIntent] = useState<Intent>(null);

  const [extraction, setExtraction] =
    useState<ExtractedInfo | null>(null);

  const [pendingHive, setPendingHive] =
    useState<string | undefined>();

  const [pendingQty, setPendingQty] =
    useState<number | undefined>();

  const [pendingInspection, setPendingInspection] =
    useState<string>('');

  const [pendingIssue, setPendingIssue] =
    useState<string>('');

  const [pendingSeverity, setPendingSeverity] =
    useState<string>('');

  const [harvestCreated, setHarvestCreated] =
    useState<Harvest | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages]);

  const addMsg = (msg: Omit<ChatMessage, 'id'>) => {
    setMessages((prev) => [
      ...prev,
      {
        ...msg,
        id: `m${prev.length}_${Date.now()}`,
      },
    ]);
  };

  /*
   * START AN ACTION
   */
  const startIntent = (selectedIntent: Intent) => {
    setIntent(selectedIntent);
    setPendingHive(undefined);
    setPendingQty(undefined);
    setPendingInspection('');
    setPendingIssue('');
    setPendingSeverity('');
    setExtraction(null);

    if (selectedIntent === 'harvest') {
      setStage('awaiting_hive');

      setTimeout(() => {
        addMsg({
          sender: 'assistant',
          text:
            'Sure! Which hive did you harvest from?',
          kind: 'quick-reply',
          quickReplies: beekeeperHives.map(
            (h) => `Hive ${h.id}`
          ),
        });
      }, 400);
    }

    if (selectedIntent === 'inspection') {
      setStage('awaiting_hive');

=======
      quickReplies: ['Record Inspection', 'Record Harvest', 'Report Hive Issue'],
    },
  ]);
  const [input, setInput] = useState('');
  const [stage, setStage] = useState<Stage>('idle');
  const [extraction, setExtraction] = useState<ExtractedInfo | null>(null);
  const [pendingHive, setPendingHive] = useState<string | undefined>();
  const [pendingQty, setPendingQty] = useState<number | undefined>();
  const [harvestCreated, setHarvestCreated] = useState<Harvest | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const addMsg = (msg: Omit<ChatMessage, 'id'>) => {
    setMessages((prev) => [...prev, { ...msg, id: `m${prev.length}_${Date.now()}` }]);
  };

  const handleQuickReply = (reply: string) => {
    addMsg({ sender: 'user', text: reply, kind: 'text' });

    if (reply === 'Record Harvest' || reply.toLowerCase().includes('harvest')) {
      setTimeout(() => {
        addMsg({
          sender: 'assistant',
          text: 'Sure! Tell me about your harvest. Which hive, how much honey, and when? You can type or speak in Hindi or English.',
          kind: 'text',
        });
      }, 400);
      setStage('awaiting_hive');
    } else if (reply === 'Record Inspection') {
>>>>>>> 55c13742b2b40ab37ad8e0da10183586db2d41d6
      setTimeout(() => {
        addMsg({
          sender: 'assistant',
          text: 'Which hive would you like to inspect?',
          kind: 'quick-reply',
<<<<<<< HEAD
          quickReplies: beekeeperHives.map(
            (h) => `Hive ${h.id}`
          ),
        });
      }, 400);
    }

    if (selectedIntent === 'issue') {
      setStage('awaiting_hive');

=======
          quickReplies: beekeeperHives.map((h) => `Hive ${h.id}`),
        });
      }, 400);
    } else if (reply === 'Report Hive Issue') {
>>>>>>> 55c13742b2b40ab37ad8e0da10183586db2d41d6
      setTimeout(() => {
        addMsg({
          sender: 'assistant',
          text: 'Which hive has the issue?',
          kind: 'quick-reply',
<<<<<<< HEAD
          quickReplies: beekeeperHives.map(
            (h) => `Hive ${h.id}`
          ),
        });
      }, 400);
    }
  };

  /*
   * QUICK REPLY HANDLER
   */
  const handleQuickReply = (reply: string) => {
    addMsg({
      sender: 'user',
      text: reply,
      kind: 'text',
    });

    /*
     * Main actions
     */
    if (reply === 'Record Harvest') {
      startIntent('harvest');
      return;
    }

    if (reply === 'Record Inspection') {
      startIntent('inspection');
      return;
    }

    if (reply === 'Report Hive Issue') {
      startIntent('issue');
      return;
    }

    /*
     * Confirmation
     */
    if (reply === '✓ Confirm') {
      handleConfirm(true);
      return;
    }

    if (reply === '✎ Correct') {
      handleConfirm(false);
      return;
    }

    /*
     * Hive selection
     */
    if (reply.startsWith('Hive ')) {
      const hiveId = reply.replace('Hive ', '').trim();

      handleHiveSelect(hiveId);
      return;
    }

    /*
     * Harvest quantity
     */
    if (
      intent === 'harvest' &&
      reply.match(/^\d+(?:\.\d+)?\s*kg$/i)
    ) {
      const qty = parseFloat(reply);

      handleQtySelect(qty);
      return;
    }

    /*
     * Inspection quick replies
     */
    if (
      intent === 'inspection' &&
      stage === 'awaiting_inspection'
    ) {
      handleInspectionSelect(reply);
      return;
    }

    /*
     * Issue quick replies
     */
    if (
      intent === 'issue' &&
      stage === 'awaiting_issue'
    ) {
      handleIssueSelect(reply);
      return;
    }
  };

  /*
   * HIVE SELECTION
   *
   * This is the critical fix.
   * The selected intent is preserved.
   */
  const handleHiveSelect = (hiveId: string) => {
    const hive = beekeeperHives.find(
      (h) => h.id === hiveId
    );

    if (!hive) {
      addMsg({
        sender: 'assistant',
        text:
          `Action rejected. Hive ${hiveId} is not a registered hive associated with your account.`,
        kind: 'text',
      });

      setStage('rejected');
      return;
    }

    setPendingHive(hiveId);

    /*
     * HARVEST
     */
    if (intent === 'harvest') {
      setStage('awaiting_quantity');

      setTimeout(() => {
        addMsg({
          sender: 'assistant',
          text: 'Kitna honey harvest kiya?',
          kind: 'quick-reply',
          quickReplies: [
            '3 kg',
            '5 kg',
            '10 kg',
          ],
        });
      }, 400);

      return;
    }

    /*
     * INSPECTION
     */
    if (intent === 'inspection') {
      setStage('awaiting_inspection');

      setTimeout(() => {
        addMsg({
          sender: 'assistant',
          text:
            `Hive ${hiveId} selected.\n\nHow does the hive look today?`,
          kind: 'quick-reply',
          quickReplies: [
            'Healthy',
            'Needs Attention',
            'Critical',
          ],
        });
      }, 400);

      return;
    }

    /*
     * ISSUE
     */
    if (intent === 'issue') {
      setStage('awaiting_issue');

      setTimeout(() => {
        addMsg({
          sender: 'assistant',
          text:
            `Hive ${hiveId} selected.\n\nWhat type of issue did you observe?`,
          kind: 'quick-reply',
          quickReplies: [
            'Low Bee Activity',
            'Pest / Disease Risk',
            'Queen Issue',
            'Physical Damage',
            'Other',
          ],
        });
      }, 400);
    }
  };

  /*
   * HARVEST QUANTITY
   */
  const handleQtySelect = (qty: number) => {
    setPendingQty(qty);

=======
          quickReplies: beekeeperHives.map((h) => `Hive ${h.id}`),
        });
      }, 400);
    } else if (reply.startsWith('Hive ')) {
      const hiveId = reply.replace('Hive ', '');
      handleHiveSelect(hiveId);
    } else if (reply.match(/^\d+\s*kg$/)) {
      const qty = parseFloat(reply);
      handleQtySelect(qty);
    }
  };

  const handleHiveSelect = (hiveId: string) => {
    // Validate hive
    const hive = beekeeperHives.find((h) => h.id === hiveId);
    if (!hive) {
      addMsg({
        sender: 'assistant',
        text: `Harvest rejected. Hive ${hiveId} is not a registered hive associated with your account.`,
        kind: 'text',
      });
      setStage('rejected');
      return;
    }
    setPendingHive(hiveId);
    setStage('awaiting_quantity');
    setTimeout(() => {
      addMsg({
        sender: 'assistant',
        text: 'Kitna honey harvest kiya?',
        kind: 'quick-reply',
        quickReplies: ['3 kg', '5 kg', '10 kg'],
      });
    }, 400);
  };

  const handleQtySelect = (qty: number) => {
    setPendingQty(qty);
>>>>>>> 55c13742b2b40ab37ad8e0da10183586db2d41d6
    const info: ExtractedInfo = {
      hiveId: pendingHive,
      event: 'HARVEST',
      quantity: qty,
      unit: 'kg',
      date: 'Today',
      language: 'Hindi/English mixed',
      confidence: 94,
      missing: [],
    };
<<<<<<< HEAD

    setExtraction(info);
    setStage('confirming');

    setTimeout(() => {
      addMsg({
        sender: 'assistant',
        text:
          `I understood:\n\nHive: ${pendingHive}\nEvent: Harvest\nQuantity: ${qty} kg\nDate: Today\n\nIs this correct?`,
        kind: 'extraction',
        extraction: info,
        quickReplies: [
          '✓ Confirm',
          '✎ Correct',
        ],
=======
    setExtraction(info);
    setStage('confirming');
    setTimeout(() => {
      addMsg({
        sender: 'assistant',
        text: `I understood:\n\nHive: ${pendingHive}\nEvent: Harvest\nQuantity: ${qty} kg\nDate: Today\n\nIs this correct?`,
        kind: 'extraction',
        extraction: info,
        quickReplies: ['✓ Confirm', '✎ Correct'],
>>>>>>> 55c13742b2b40ab37ad8e0da10183586db2d41d6
      });
    }, 400);
  };

<<<<<<< HEAD
  /*
   * INSPECTION CONDITION
   */
  const handleInspectionSelect = (condition: string) => {
    setPendingInspection(condition);

    setStage('confirming');

    setTimeout(() => {
      addMsg({
        sender: 'assistant',
        text:
          `Inspection details:\n\nHive: ${pendingHive}\nCondition: ${condition}\nDate: Today\n\nIs this correct?`,
        kind: 'text',
        quickReplies: [
          '✓ Confirm',
          '✎ Correct',
        ],
      });
    }, 400);
  };

  /*
   * ISSUE TYPE
   */
  const handleIssueSelect = (issue: string) => {
    setPendingIssue(issue);

    setTimeout(() => {
      addMsg({
        sender: 'assistant',
        text:
          `What is the severity of this issue?`,
        kind: 'quick-reply',
        quickReplies: [
          'Low',
          'Medium',
          'High',
        ],
      });

      setStage('awaiting_issue');
    }, 400);

    /*
     * Temporary marker.
     * The next severity selection is handled here.
     */
    setPendingSeverity('');
  };

  /*
   * FINAL CONFIRMATION
   */
  const handleConfirm = (confirmed: boolean) => {
    if (!confirmed) {
      addMsg({
        sender: 'user',
        text: '✎ Correct',
        kind: 'text',
      });

      setTimeout(() => {
        addMsg({
          sender: 'assistant',
          text:
            'No problem. Please select the hive again.',
          kind: 'quick-reply',
          quickReplies: beekeeperHives.map(
            (h) => `Hive ${h.id}`
          ),
        });
      }, 400);

=======
  const handleConfirm = (confirmed: boolean) => {
    if (!confirmed) {
      addMsg({ sender: 'user', text: '✎ Correct', kind: 'text' });
      setTimeout(() => {
        addMsg({
          sender: 'assistant',
          text: 'Some information is unclear. Please confirm or correct the details. Which hive was it?',
          kind: 'quick-reply',
          quickReplies: beekeeperHives.map((h) => `Hive ${h.id}`),
        });
      }, 400);
>>>>>>> 55c13742b2b40ab37ad8e0da10183586db2d41d6
      setStage('awaiting_hive');
      return;
    }

<<<<<<< HEAD
    addMsg({
      sender: 'user',
      text: '✓ Confirm',
      kind: 'text',
    });

    /*
     * HARVEST CONFIRMATION
     */
    if (intent === 'harvest') {
      createHarvest();
      return;
    }

    /*
     * INSPECTION CONFIRMATION
     */
    if (intent === 'inspection') {
      addMsg({
        sender: 'assistant',
        text:
          `Inspection recorded successfully.\n\n✓ Hive: ${pendingHive}\n✓ Condition: ${pendingInspection}\n✓ Beekeeper: FPO-verified BK-001\n✓ Timestamp: ${new Date().toLocaleString()}`,
        kind: 'verification',
      });

      /*
       * Local prototype audit event
       */
      appendBlock(
        'INSPECTION_RECORDED',
        'HC-001',
        `hive=${pendingHive}|condition=${pendingInspection}|beekeeper=BK-001`
      );

      setStage('verified');
      return;
    }

    /*
     * ISSUE CONFIRMATION
     */
    if (intent === 'issue') {
      addMsg({
        sender: 'assistant',
        text:
          `Hive issue reported successfully.\n\n⚠ Hive: ${pendingHive}\n⚠ Issue: ${pendingIssue}\n⚠ Severity: ${pendingSeverity || 'Medium'}\n\nThe issue has been flagged for FPO/officer review.`,
        kind: 'verification',
      });

      appendBlock(
        'HIVE_ISSUE_REPORTED',
        'HC-001',
        `hive=${pendingHive}|issue=${pendingIssue}|severity=${pendingSeverity || 'Medium'}|beekeeper=BK-001`
      );

      setStage('verified');
    }
  };

  /*
   * CREATE HARVEST
   */
  const createHarvest = () => {
    const hive = beekeeperHives.find(
      (h) => h.id === pendingHive
    );

    if (!hive || !pendingQty) return;

    const weightBefore =
      hive.weight + pendingQty;

    const weightAfter = hive.weight;

    const observedChange = +(
      weightBefore - weightAfter
    ).toFixed(1);

    /*
     * Generate a new harvest ID.
     */
    const harvestNumber =
      harvests.length + 1;

    const harvestId =
      `H${String(harvestNumber).padStart(3, '0')}`;

    /*
     * Keep existing HC-001 for the first demo harvest.
     * Additional harvests get their own batch.
     */
    const batchNumber =
      harvestNumber === 1
        ? 1
        : harvestNumber;

    const batchId =
      `HC-${String(batchNumber).padStart(3, '0')}`;

    const harvest: Harvest = {
      id: harvestId,
      beekeeperId: beekeeperId,
      hiveId: pendingHive!,
      quantityKg: pendingQty,
      date: new Date().toISOString().slice(0, 10),
      verification: 'EVIDENCE_SUPPORTED',
      batchId,
=======
    addMsg({ sender: 'user', text: '✓ Confirm', kind: 'text' });

    // Create harvest
    const hive = beekeeperHives.find((h) => h.id === pendingHive)!;
    const weightBefore = hive.weight + pendingQty!;
    const weightAfter = hive.weight;
    const observedChange = +(weightBefore - weightAfter).toFixed(1);

    const harvest: Harvest = {
      id: `H${String(harvests.length + 1).padStart(3, '0')}`,
      beekeeperId: 'BK-001',
      hiveId: pendingHive!,
      quantityKg: pendingQty!,
      date: '2026-09-01',
      verification: 'EVIDENCE_SUPPORTED',
      batchId: 'HC-001',
>>>>>>> 55c13742b2b40ab37ad8e0da10183586db2d41d6
      iot: {
        weightBefore,
        weightAfter,
        observedChange,
        temperature: hive.temperature,
        humidity: hive.humidity,
      },
      aiConfidence: 94,
<<<<<<< HEAD
      aiAnalysis:
        'Reported harvest quantity is consistent with simulated hive-weight evidence.',
    };

    addHarvest(harvest);

    setHarvestCreated(harvest);

    setStage('verified');

    appendBlock(
      'HARVEST_CONFIRMED',
      batchId,
      `hive=${pendingHive}|qty=${pendingQty}kg|beekeeper=BK-001|verification=EVIDENCE_SUPPORTED`
    );
=======
      aiAnalysis: 'Reported harvest quantity is consistent with simulated hive-weight evidence.',
    };

    addHarvest(harvest);
    setHarvestCreated(harvest);
    setStage('verified');

    // Add to blockchain
    appendBlock('HARVEST_CONFIRMED', 'HC-001', `hive=${pendingHive}|qty=${pendingQty}kg|beekeeper=BK-001|verification=EVIDENCE_SUPPORTED`);
>>>>>>> 55c13742b2b40ab37ad8e0da10183586db2d41d6

    setTimeout(() => {
      addMsg({
        sender: 'assistant',
<<<<<<< HEAD
        text:
          `Harvest recorded! Batch ${batchId} created.\n\nVerification:\n✓ Identity: FPO-verified beekeeper (BK-001)\n✓ Hive: Registered (Hive ${pendingHive})\n✓ Claim: User confirmed (${pendingQty} kg)\n✓ IoT: Supporting evidence (${observedChange} kg weight change)\n\n🟢 Verification Status: EVIDENCE SUPPORTED`,
=======
        text: `Harvest recorded! Batch HC-001 created.\n\nVerification:\n✓ Identity: FPO-verified beekeeper (BK-001)\n✓ Hive: Registered (Hive ${pendingHive})\n✓ Claim: User confirmed (${pendingQty} kg)\n✓ IoT: Supporting evidence (${observedChange} kg weight change)\n\n🟢 Verification Status: EVIDENCE SUPPORTED`,
>>>>>>> 55c13742b2b40ab37ad8e0da10183586db2d41d6
        kind: 'verification',
      });
    }, 600);
  };

<<<<<<< HEAD
  /*
   * TEXT INPUT
   */
  const handleSend = () => {
    if (!input.trim()) return;

    const text = input.trim();

    addMsg({
      sender: 'user',
      text,
      kind: 'text',
    });

    setInput('');

    /*
     * ISSUE SEVERITY
     */
    if (
      intent === 'issue' &&
      pendingIssue &&
      !pendingSeverity &&
      ['low', 'medium', 'high'].includes(
        text.toLowerCase()
      )
    ) {
      const severity =
        text.charAt(0).toUpperCase() +
        text.slice(1).toLowerCase();

      setPendingSeverity(severity);

      setStage('confirming');

      setTimeout(() => {
        addMsg({
          sender: 'assistant',
          text:
            `Issue report:\n\nHive: ${pendingHive}\nIssue: ${pendingIssue}\nSeverity: ${severity}\nDate: Today\n\nIs this correct?`,
          kind: 'text',
          quickReplies: [
            '✓ Confirm',
            '✎ Correct',
          ],
        });
      }, 400);

      return;
    }

    /*
     * Inspection typed response
     */
    if (
      intent === 'inspection' &&
      stage === 'awaiting_inspection'
    ) {
      handleInspectionSelect(text);
      return;
    }

    /*
     * Issue typed response
     */
    if (
      intent === 'issue' &&
      stage === 'awaiting_issue' &&
      !pendingIssue
    ) {
      handleIssueSelect(text);
      return;
    }

    /*
     * Harvest flow
     */
    if (
      intent === 'harvest' &&
      stage === 'awaiting_quantity'
    ) {
      const qty = parseFloat(
        text.match(/\d+(?:\.\d+)?/)?.[0] || ''
      );

=======
  const handleSend = () => {
    if (!input.trim()) return;
    const text = input.trim();
    addMsg({ sender: 'user', text, kind: 'text' });
    setInput('');

    // Process based on stage
    if (stage === 'awaiting_hive' || stage === 'idle') {
      const info = extractFromMessage(text);

      // Check for unregistered hive
      const hiveMatch = text.match(/hive\s*(\d+)|hive\s*#?\s*(\d+)/i);
      if (hiveMatch) {
        const hiveId = hiveMatch[1] || hiveMatch[2];
        const hive = beekeeperHives.find((h) => h.id === hiveId);
        if (!hive) {
          setTimeout(() => {
            addMsg({
              sender: 'assistant',
              text: `Harvest rejected. Hive ${hiveId} is not a registered hive associated with your account.`,
              kind: 'text',
            });
          }, 500);
          setStage('rejected');
          return;
        }
      }

      if (info.hiveId && info.quantity) {
        // Complete extraction
        const hive = beekeeperHives.find((h) => h.id === info.hiveId);
        if (!hive) {
          setTimeout(() => {
            addMsg({
              sender: 'assistant',
              text: `Harvest rejected. Hive ${info.hiveId} is not a registered hive associated with your account.`,
              kind: 'text',
            });
          }, 500);
          return;
        }
        setPendingHive(info.hiveId);
        setPendingQty(info.quantity);
        setExtraction(info);
        setStage('confirming');
        setTimeout(() => {
          addMsg({
            sender: 'assistant',
            text: `AI EXTRACTION\n\nHive ID       ${info.hiveId}\nEvent         HARVEST\nQuantity      ${info.quantity} kg\nDate          Today\nConfidence    ${info.confidence}%\n\nI understood Hive ${info.hiveId}, ${info.quantity} kg harvest. Is this correct?`,
            kind: 'extraction',
            extraction: info,
            quickReplies: ['✓ Confirm', '✎ Correct'],
          });
        }, 600);
        return;
      }

      if (info.missing.length > 0) {
        setExtraction(info);
        if (info.missing.includes('Hive ID')) {
          setStage('awaiting_hive');
          setTimeout(() => {
            addMsg({
              sender: 'assistant',
              text: 'Kaunsa hive tha?',
              kind: 'quick-reply',
              quickReplies: beekeeperHives.map((h) => `Hive ${h.id}`),
            });
          }, 500);
        } else if (info.missing.includes('Quantity')) {
          setStage('awaiting_quantity');
          setTimeout(() => {
            addMsg({
              sender: 'assistant',
              text: 'Kitna honey harvest kiya?',
              kind: 'quick-reply',
              quickReplies: ['3 kg', '5 kg', '10 kg'],
            });
          }, 500);
        }
        return;
      }
    }

    if (stage === 'awaiting_quantity') {
      const qty = parseFloat(text.match(/\d+(?:\.\d+)?/)?.[0] || '');
>>>>>>> 55c13742b2b40ab37ad8e0da10183586db2d41d6
      if (qty) {
        handleQtySelect(qty);
        return;
      }
    }

<<<<<<< HEAD
    /*
     * Hive input
     */
    if (
      stage === 'awaiting_hive' ||
      stage === 'idle'
    ) {
      const hiveMatch = text.match(
        /hive\s*#?\s*(\d+)/i
      );

      if (hiveMatch) {
        const hiveId = hiveMatch[1];

        handleHiveSelect(hiveId);
        return;
      }

      /*
       * Harvest AI extraction
       */
      if (intent === 'harvest') {
        const info =
          extractFromMessage(text);

        if (
          info.hiveId &&
          info.quantity
        ) {
          const hive =
            beekeeperHives.find(
              (h) => h.id === info.hiveId
            );

          if (!hive) {
            addMsg({
              sender: 'assistant',
              text:
                `Harvest rejected. Hive ${info.hiveId} is not registered with your account.`,
              kind: 'text',
            });

            setStage('rejected');
            return;
          }

          setPendingHive(info.hiveId);
          setPendingQty(info.quantity);
          setExtraction(info);
          setStage('confirming');

          setTimeout(() => {
            addMsg({
              sender: 'assistant',
              text:
                `AI EXTRACTION\n\nHive ID       ${info.hiveId}\nEvent         HARVEST\nQuantity      ${info.quantity} kg\nDate          Today\nConfidence    ${info.confidence}%\n\nI understood Hive ${info.hiveId}, ${info.quantity} kg harvest. Is this correct?`,
              kind: 'extraction',
              extraction: info,
              quickReplies: [
                '✓ Confirm',
                '✎ Correct',
              ],
            });
          }, 500);

          return;
        }
      }

      /*
       * Generic response
       */
      setTimeout(() => {
        addMsg({
          sender: 'assistant',
          text:
            'Please select one of your registered hives, for example "Hive 12".',
          kind: 'text',
        });
      }, 400);
    }
  };

  /*
   * VOICE SIMULATION
   */
  const handleVoice = () => {
    addMsg({
      sender: 'user',
      text: '🎤 Voice message',
      kind: 'voice',
    });

    setTimeout(() => {
      addMsg({
        sender: 'assistant',
        text:
          'I heard: "Aaj honey harvest kiya."',
        kind: 'text',
      });

      setIntent('harvest');
      setStage('awaiting_hive');

=======
    // Default: try to extract
    const info = extractFromMessage(text);
    if (info.confidence < 70) {
      setTimeout(() => {
        addMsg({
          sender: 'assistant',
          text: 'Some information is unclear. Please confirm or correct the details. You can say something like "Hive 12 se 3 kg honey harvest kiya."',
          kind: 'text',
        });
      }, 500);
    }
  };

  const handleVoice = () => {
    addMsg({ sender: 'user', text: '🎤 Voice message', kind: 'voice' });
    setTimeout(() => {
      addMsg({
        sender: 'assistant',
        text: 'I heard: "Aaj honey harvest kiya."',
        kind: 'text',
      });
>>>>>>> 55c13742b2b40ab37ad8e0da10183586db2d41d6
      setTimeout(() => {
        addMsg({
          sender: 'assistant',
          text: 'Kaunsa hive tha?',
          kind: 'quick-reply',
<<<<<<< HEAD
          quickReplies: beekeeperHives.map(
            (h) => `Hive ${h.id}`
          ),
        });
      }, 400);
    }, 600);
  };

  const lastMsg =
    messages[messages.length - 1];
=======
          quickReplies: beekeeperHives.map((h) => `Hive ${h.id}`),
        });
      }, 400);
      setStage('awaiting_hive');
    }, 600);
  };

  const lastMsg = messages[messages.length - 1];
>>>>>>> 55c13742b2b40ab37ad8e0da10183586db2d41d6

  return (
    <div className="min-h-screen bg-ink-100 flex items-center justify-center py-6 px-4">
      <div className="w-full max-w-md h-[88vh] flex flex-col bg-white rounded-2xl shadow-xl overflow-hidden border border-ink-200">
<<<<<<< HEAD

        {/* Header */}
        <div className="bg-forest-700 text-white px-4 py-3 flex items-center gap-3 flex-shrink-0">
          <Link
            to="/"
            className="text-forest-200 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>

          <div className="w-10 h-10 rounded-full bg-honey-400 flex items-center justify-center text-white font-display font-bold">
            🐝
          </div>

          <div className="flex-1">
            <p className="font-display font-bold text-sm">
              HoneyChain Assistant
            </p>

=======
        {/* Chat header */}
        <div className="bg-forest-700 text-white px-4 py-3 flex items-center gap-3 flex-shrink-0">
          <Link to="/" className="text-forest-200 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="w-10 h-10 rounded-full bg-honey-400 flex items-center justify-center text-white font-display font-bold">
            🐝
          </div>
          <div className="flex-1">
            <p className="font-display font-bold text-sm">HoneyChain Assistant</p>
>>>>>>> 55c13742b2b40ab37ad8e0da10183586db2d41d6
            <p className="text-xs text-forest-200 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-forest-300 animate-pulse-soft" />
              AI Beekeeping Assistant
            </p>
          </div>
<<<<<<< HEAD

=======
>>>>>>> 55c13742b2b40ab37ad8e0da10183586db2d41d6
          <Logo size="sm" />
        </div>

        {/* Messages */}
<<<<<<< HEAD
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-ink-50"
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.sender === 'user'
                  ? 'justify-end'
                  : 'justify-start'
              } animate-slide-in`}
            >
              <div
                className={`max-w-[80%] ${
                  msg.sender === 'user'
                    ? 'order-2'
                    : ''
                }`}
              >

                {msg.kind === 'voice' ? (
                  <div className="bg-honey-500 text-white rounded-2xl rounded-tr-sm px-4 py-3 flex items-center gap-2">
                    <Mic className="w-4 h-4" />

                    <div className="flex items-center gap-0.5">
                      {[3, 6, 10, 14, 8, 12, 5, 9, 4, 7, 11, 3].map(
                        (h, i) => (
                          <div
                            key={i}
                            className="w-0.5 bg-white/70 rounded-full animate-pulse-soft"
                            style={{
                              height: `${h}px`,
                              animationDelay: `${i * 80}ms`,
                            }}
                          />
                        )
                      )}
                    </div>

                    <span className="text-xs font-mono">
                      0:03
                    </span>
                  </div>

                ) : msg.kind === 'extraction' &&
                  msg.extraction ? (

                  <div className="bg-white border border-honey-200 rounded-2xl rounded-tl-sm overflow-hidden shadow-sm">

                    <div className="bg-honey-50 px-3 py-1.5 flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5 text-honey-600" />

                      <span className="text-xs font-bold text-honey-700">
                        AI EXTRACTION
                      </span>
                    </div>

                    <div className="p-3">
                      <table className="text-xs w-full">
                        <tbody>
                          <tr>
                            <td className="text-ink-400 pr-3 py-0.5">
                              Hive ID
                            </td>

                            <td className="font-mono font-bold text-ink-900">
                              {msg.extraction.hiveId || '—'}
                            </td>
                          </tr>

                          <tr>
                            <td className="text-ink-400 pr-3 py-0.5">
                              Event
                            </td>

                            <td className="font-bold text-ink-900">
                              {msg.extraction.event || '—'}
                            </td>
                          </tr>

                          <tr>
                            <td className="text-ink-400 pr-3 py-0.5">
                              Quantity
                            </td>

                            <td className="font-bold text-ink-900">
                              {msg.extraction.quantity
                                ? `${msg.extraction.quantity} ${msg.extraction.unit}`
                                : '—'}
                            </td>
                          </tr>

                          <tr>
                            <td className="text-ink-400 pr-3 py-0.5">
                              Date
                            </td>

                            <td className="text-ink-900">
                              {msg.extraction.date || 'Today'}
                            </td>
                          </tr>

                          <tr>
                            <td className="text-ink-400 pr-3 py-0.5">
                              Confidence
                            </td>

                            <td className="font-bold text-honey-600">
                              {msg.extraction.confidence}%
                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <p className="text-xs text-ink-600 mt-2 pt-2 border-t border-ink-100 whitespace-pre-line">
                        {msg.text}
                      </p>
                    </div>
                  </div>

                ) : msg.kind === 'verification' ? (

                  <div className="bg-white border border-forest-200 rounded-2xl rounded-tl-sm overflow-hidden shadow-sm">

                    <div className="bg-forest-50 px-3 py-1.5 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-forest-600" />

                      <span className="text-xs font-bold text-forest-700">
                        RECORDING COMPLETE
                      </span>
                    </div>

                    <div className="p-3">
                      <p className="text-xs text-ink-700 whitespace-pre-line">
                        {msg.text}
                      </p>

                      {intent === 'harvest' && (
                        <Link
                          to={`/batch/${harvestCreated?.batchId || 'HC-001'}`}
                          className="btn-primary text-xs mt-3 w-full py-2"
                        >
                          View Batch & QR Code
                        </Link>
                      )}
                    </div>
                  </div>

                ) : (
                  <div
                    className={`px-4 py-2.5 rounded-2xl text-sm whitespace-pre-line ${
                      msg.sender === 'user'
                        ? 'bg-honey-500 text-white rounded-tr-sm'
                        : 'bg-white text-ink-800 rounded-tl-sm shadow-sm border border-ink-100'
                    }`}
                  >
=======
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-ink-50">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-slide-in`}>
              <div className={`max-w-[80%] ${msg.sender === 'user' ? 'order-2' : ''}`}>
                {msg.kind === 'voice' ? (
                  <div className="bg-honey-500 text-white rounded-2xl rounded-tr-sm px-4 py-3 flex items-center gap-2">
                    <Mic className="w-4 h-4" />
                    <div className="flex items-center gap-0.5">
                      {[3, 6, 10, 14, 8, 12, 5, 9, 4, 7, 11, 3].map((h, i) => (
                        <div key={i} className="w-0.5 bg-white/70 rounded-full animate-pulse-soft" style={{ height: `${h}px`, animationDelay: `${i * 80}ms` }} />
                      ))}
                    </div>
                    <span className="text-xs font-mono">0:03</span>
                  </div>
                ) : msg.kind === 'extraction' && msg.extraction ? (
                  <div className="bg-white border border-honey-200 rounded-2xl rounded-tl-sm overflow-hidden shadow-sm">
                    <div className="bg-honey-50 px-3 py-1.5 flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5 text-honey-600" />
                      <span className="text-xs font-bold text-honey-700">AI EXTRACTION</span>
                    </div>
                    <div className="p-3">
                      <table className="text-xs w-full">
                        <tbody>
                          <tr><td className="text-ink-400 pr-3 py-0.5">Hive ID</td><td className="font-mono font-bold text-ink-900">{msg.extraction.hiveId || '—'}</td></tr>
                          <tr><td className="text-ink-400 pr-3 py-0.5">Event</td><td className="font-bold text-ink-900">{msg.extraction.event || '—'}</td></tr>
                          <tr><td className="text-ink-400 pr-3 py-0.5">Quantity</td><td className="font-bold text-ink-900">{msg.extraction.quantity ? `${msg.extraction.quantity} ${msg.extraction.unit}` : '—'}</td></tr>
                          <tr><td className="text-ink-400 pr-3 py-0.5">Date</td><td className="text-ink-900">{msg.extraction.date || 'Today'}</td></tr>
                          <tr><td className="text-ink-400 pr-3 py-0.5">Confidence</td><td className="font-bold text-honey-600">{msg.extraction.confidence}%</td></tr>
                        </tbody>
                      </table>
                      <p className="text-xs text-ink-600 mt-2 pt-2 border-t border-ink-100 whitespace-pre-line">{msg.text.split('\n\n')[msg.text.split('\n\n').length - 1]}</p>
                    </div>
                  </div>
                ) : msg.kind === 'verification' ? (
                  <div className="bg-white border border-forest-200 rounded-2xl rounded-tl-sm overflow-hidden shadow-sm">
                    <div className="bg-forest-50 px-3 py-1.5 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-forest-600" />
                      <span className="text-xs font-bold text-forest-700">VERIFICATION COMPLETE</span>
                    </div>
                    <div className="p-3">
                      <p className="text-xs text-ink-700 whitespace-pre-line">{msg.text}</p>
                      <Link to="/batch/HC-001" className="btn-primary text-xs mt-3 w-full py-2">
                        View Batch & QR Code
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className={`px-4 py-2.5 rounded-2xl text-sm whitespace-pre-line ${
                    msg.sender === 'user'
                      ? 'bg-honey-500 text-white rounded-tr-sm'
                      : 'bg-white text-ink-800 rounded-tl-sm shadow-sm border border-ink-100'
                  }`}>
>>>>>>> 55c13742b2b40ab37ad8e0da10183586db2d41d6
                    {msg.text}
                  </div>
                )}

<<<<<<< HEAD
                {/* Quick Replies */}
                {msg.quickReplies &&
                  msg === lastMsg &&
                  stage !== 'verified' &&
                  stage !== 'rejected' && (
                    <div className="flex flex-wrap gap-2 mt-2">

                      {msg.quickReplies.map((qr) => (
                        <button
                          key={qr}
                          onClick={() =>
                            handleQuickReply(qr)
                          }
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold hover:bg-honey-50 active:scale-95 transition-all ${
                            qr === 'High'
                              ? 'bg-red-50 border border-red-200 text-red-700'
                              : qr === 'Medium'
                                ? 'bg-yellow-50 border border-yellow-200 text-yellow-700'
                                : qr === 'Low'
                                  ? 'bg-green-50 border border-green-200 text-green-700'
                                  : 'bg-white border border-honey-300 text-honey-700'
                          }`}
                        >
                          {qr}
                        </button>
                      ))}

                    </div>
                  )}

=======
                {/* Quick replies */}
                {msg.quickReplies && msg === lastMsg && stage !== 'verified' && stage !== 'rejected' && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {msg.quickReplies.map((qr) => (
                      <button
                        key={qr}
                        onClick={() => handleQuickReply(qr)}
                        className="px-3 py-1.5 rounded-full bg-white border border-honey-300 text-honey-700 text-xs font-semibold hover:bg-honey-50 active:scale-95 transition-all"
                      >
                        {qr}
                      </button>
                    ))}
                  </div>
                )}
                {msg.quickReplies && msg === lastMsg && stage === 'confirming' && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {msg.quickReplies.map((qr) => (
                      <button
                        key={qr}
                        onClick={() => handleConfirm(qr === '✓ Confirm')}
                        className={`px-4 py-2 rounded-full text-xs font-bold transition-all active:scale-95 ${
                          qr.includes('Confirm')
                            ? 'bg-forest-500 text-white hover:bg-forest-600'
                            : 'bg-white border border-ink-300 text-ink-700 hover:bg-ink-50'
                        }`}
                      >
                        {qr}
                      </button>
                    ))}
                  </div>
                )}
>>>>>>> 55c13742b2b40ab37ad8e0da10183586db2d41d6
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="px-3 py-3 bg-white border-t border-ink-200 flex items-center gap-2 flex-shrink-0">
<<<<<<< HEAD

          <input
            type="text"
            value={input}
            onChange={(e) =>
              setInput(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSend();
              }
            }}
            placeholder="Type a message..."
            className="flex-1 rounded-full bg-ink-100 border-0 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-honey-200"
          />

=======
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            className="flex-1 rounded-full bg-ink-100 border-0 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-honey-200"
          />
>>>>>>> 55c13742b2b40ab37ad8e0da10183586db2d41d6
          <button
            onClick={handleVoice}
            className="w-10 h-10 rounded-full bg-honey-50 text-honey-600 flex items-center justify-center hover:bg-honey-100 active:scale-95 transition-all"
            title="Simulate voice message"
          >
            <Mic className="w-5 h-5" />
          </button>
<<<<<<< HEAD

=======
>>>>>>> 55c13742b2b40ab37ad8e0da10183586db2d41d6
          <button
            onClick={handleSend}
            className="w-10 h-10 rounded-full bg-forest-500 text-white flex items-center justify-center hover:bg-forest-600 active:scale-95 transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
<<<<<<< HEAD

=======
>>>>>>> 55c13742b2b40ab37ad8e0da10183586db2d41d6
        </div>

        {/* Prototype notice */}
        <div className="px-4 py-1.5 bg-ink-100 text-center flex-shrink-0">
          <p className="text-[10px] text-ink-400">
            Prototype · Not connected to real WhatsApp API · Production uses Meta WhatsApp Cloud API
          </p>
        </div>
<<<<<<< HEAD

      </div>
    </div>
  );
}
=======
      </div>
    </div>
  );
}
>>>>>>> 55c13742b2b40ab37ad8e0da10183586db2d41d6
